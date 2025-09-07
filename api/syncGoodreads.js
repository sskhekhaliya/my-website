const fetch = require('node-fetch');
const xml2js = require('xml2js');
const { createClient } = require('@sanity/client');
// We remove `got` from here because it's now an ESM package
// const got = require('got'); 

// Configure Sanity client
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03',
});

// Helper: Get Google Books cover URL
const getBookCoverUrl = async (title, author) => {
  // Corrected the environment variable name as requested
  const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
  if (!GOOGLE_BOOKS_API_KEY) return null;

  // Helper function to perform a search query and return a cover URL
  const performSearch = async (query) => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      query
    )}&key=${GOOGLE_BOOKS_API_KEY}`;
    
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request to Google Books API timed out')), 8000)
      );
      const fetchPromise = fetch(url);
      const response = await Promise.race([fetchPromise, timeoutPromise]);

      if (!response.ok) {
        console.error(`[DEBUG] Google Books API responded with status: ${response.status} for query: "${query}"`);
        return null;
      }

      const data = await response.json();
      return data.items?.map(item => item.volumeInfo?.imageLinks?.thumbnail).find(Boolean) || null;
    } catch (error) {
      console.error(`[DEBUG] Failed to fetch cover for query "${query}":`, error.message);
      return null;
    }
  };

  // --- Search Strategy ---

  // Attempt 1: Precise search with the full title and author
  let coverUrl = await performSearch(`${title} ${author}`);
  if (coverUrl) {
    console.log(`[DEBUG] Cover URL for "${title}" (Attempt 1: Precise):`, coverUrl);
    return coverUrl;
  }

  // Attempt 2: Broader search with a simplified title (removes subtitles)
  const simplifiedTitle = title.split(/[:(]/)[0].trim();
  if (simplifiedTitle.toLowerCase() !== title.toLowerCase()) {
    coverUrl = await performSearch(`${simplifiedTitle} ${author}`);
    if (coverUrl) {
      console.log(`[DEBUG] Cover URL for "${title}" (Attempt 2: Simplified Title):`, coverUrl);
      return coverUrl;
    }
  }
  
  // If we reach here, all attempts have failed.
  console.log(`[DEBUG] No cover found for "${title}" after all attempts.`);
  return null;
};

// --- Main Serverless Function ---
module.exports = async (req, res) => {
  // --- THIS IS THE FIX ---
  // We dynamically import the ESM `got` package inside our async function.
  const { default: got } = await import('got');

  // Helper to create a URL-friendly slug
  const slugify = (text) => {
    return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
  };

  try {
    console.log('--- Step 1: Starting sync function ---');
    const GOODREADS_USER_ID = process.env.GOODREADS_USER_ID;
    const RSS_URL = `https://www.goodreads.com/review/list_rss/${GOODREADS_USER_ID}?shelf=read`;

    const rssResponse = await fetch(RSS_URL);
    if (!rssResponse.ok) {
        throw new Error(`Failed to fetch Goodreads RSS feed: ${rssResponse.statusText}`);
    }
    const xml = await rssResponse.text();
    const parser = new xml2js.Parser({ explicitArray: false });
    const rssData = await parser.parseStringPromise(xml);

    const items = rssData?.rss?.channel?.item || [];
    const goodreadsBooks = (Array.isArray(items) ? items : [items]).map(item => ({
      title: item.title?.trim() || 'Untitled',
      author: item.author_name?.trim() || 'Unknown',
    }));
    console.log(`--- Step 2: Successfully fetched and parsed RSS. Found ${goodreadsBooks.length} books. ---`);

    const sanityBooks = await sanityClient.fetch(
      `*[_type == "bookReview"]{_id, title, "hasCover": defined(coverImage.asset->_id)}`
    );
    const sanityBookMap = new Map(sanityBooks.map(b => [b.title, { id: b._id, hasCover: b.hasCover }]));
    console.log(`--- Step 3: Successfully fetched from Sanity. Found ${sanityBookMap.size} existing books. ---`);

    console.log('--- Step 4: Starting to process books. ---');
    const bookProcessingPromises = goodreadsBooks.map(async (book) => {
      const existingBook = sanityBookMap.get(book.title);
      if (existingBook?.hasCover) return { status: 'skipped' };

      try {
        let imageAsset = null;
        const coverUrl = await getBookCoverUrl(book.title, book.author);

        if (coverUrl) {
          // This call will now work correctly
          const imageBuffer = await got(coverUrl, {
            responseType: 'buffer',
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
          }).buffer();

          if (imageBuffer.length > 0) {
            imageAsset = await sanityClient.assets.upload('image', imageBuffer, {
              filename: `${slugify(book.title)}.jpg`,
            });
          }
        }
        return { status: 'processed', book, imageAsset, existingBook };
      } catch (error) {
        console.error(`❌ Failed to process cover for "${book.title}":`, error.message);
        return { status: 'processed_no_cover', book, imageAsset: null, existingBook };
      }
    });

    const results = await Promise.allSettled(bookProcessingPromises);
    const transaction = sanityClient.transaction();

    results.forEach(result => {
      if (result.status !== 'fulfilled' || !result.value) return;
      const { status, book, imageAsset, existingBook } = result.value;
      if (status === 'skipped') return;

      if (existingBook && !existingBook.hasCover && imageAsset) {
        transaction.patch(existingBook.id, { set: { coverImage: { _type: 'image', asset: { _type: 'reference', _ref: imageAsset._id } } } });
      } else if (!existingBook) {
        const newDoc = {
          _type: 'bookReview',
          title: book.title,
          author: book.author,
          slug: { _type: 'slug', current: slugify(book.title) },
          yourRating: 3,
          yourReview: [ { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Write your review here...' }] } ],
          ...(imageAsset && { coverImage: { _type: 'image', asset: { _type: 'reference', _ref: imageAsset._id } } }),
        };
        transaction.create(newDoc);
      }
    });

    if (transaction.operations.length === 0) {
      return res.status(200).json({ message: 'Sync complete. No new books or covers to add.' });
    }
    await transaction.commit();
    res.status(200).json({ message: 'Books synced successfully.', operations: transaction.operations.length });
  } catch (error) {
    console.error('--- SERVERLESS FUNCTION ERROR ---', error);
    res.status(500).json({ error: error.message });
  }
};


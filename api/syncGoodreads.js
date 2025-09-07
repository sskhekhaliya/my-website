const fetch = require('node-fetch');
const xml2js = require('xml2js');
const { createClient } = require('@sanity/client');

// Configure Sanity client
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03',
});

// --- Main Serverless Function (Simplified Logic) ---
module.exports = async (req, res) => {
    const { default: got } = await import('got');

    const slugify = (text) => {
        return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
    };

    // Helper function to strip HTML tags from the description
    const stripHtml = (html) => {
        if (!html) return '';
        return html.replace(/<[^>]*>?/gm, '');
    };

    try {
        console.log('--- Step 1: Starting sync function ---');
        const GOODREADS_USER_ID = process.env.GOODREADS_USER_ID;
        const RSS_URL = `https://www.goodreads.com/review/list_rss/${GOODREADS_USER_ID}?shelf=read`;

        const rssResponse = await fetch(RSS_URL);
        if (!rssResponse.ok) throw new Error(`Failed to fetch Goodreads RSS feed: ${rssResponse.statusText}`);

        const xml = await rssResponse.text();
        const parser = new xml2js.Parser({ explicitArray: false });
        const rssData = await parser.parseStringPromise(xml);

        const items = rssData?.rss?.channel?.item || [];
        
        // --- UPDATED: Extract description along with other details ---
        const goodreadsBooks = (Array.isArray(items) ? items : [items]).map(item => ({
            title: item.title?.trim() || 'Untitled',
            author: item.author_name?.trim() || 'Unknown',
            coverUrl: item.book_large_image_url || item.book_medium_image_url || item.book_image_url || null,
            // --- NEW: Extract book description ---
            description: item.book_description || ''
        }));
        console.log(`--- Step 2: Fetched ${goodreadsBooks.length} books from Goodreads. ---`);

        // --- UPDATED: Fetch 'hasDescription' status from Sanity ---
        const allSanityBooks = await sanityClient.fetch(`*[_type == "bookReview"]{_id, title, "hasCover": defined(coverImage.asset->_id), "hasDescription": defined(bookDescription) && bookDescription != ""}`);
        const sanityBooks = allSanityBooks.filter(book => book && book._id && book.title);
        
        // --- UPDATED: Add 'hasDescription' to the map ---
        const sanityBookMap = new Map(sanityBooks.map(b => [b.title, { id: b._id, hasCover: b.hasCover, hasDescription: b.hasDescription }]));
        console.log(`--- Step 3: Fetched ${sanityBookMap.size} valid books from Sanity. ---`);

        const transaction = sanityClient.transaction();

        const goodreadsTitlesSet = new Set(goodreadsBooks.map(b => b.title));
        const booksToDelete = sanityBooks.filter(book => !goodreadsTitlesSet.has(book.title));

        if (booksToDelete.length > 0) {
            console.log(`--- Identified ${booksToDelete.length} book(s) to delete. ---`);
            booksToDelete.forEach(book => {
                console.log(`[DELETE] Preparing to delete "${book.title}" (ID: ${book._id})`);
                transaction.delete(book._id);
            });
        }

        console.log('--- Step 4: Starting to process and sync books. ---');
        
        const bookProcessingPromises = goodreadsBooks.map(async (book) => {
            const existingBook = sanityBookMap.get(book.title);
            // --- UPDATED: Skip only if both cover and description exist ---
            if (existingBook?.hasCover && existingBook?.hasDescription) return { status: 'skipped' };

            try {
                let imageAsset = null;
                if (book.coverUrl && !existingBook?.hasCover) { // Only download image if needed
                    const imageBuffer = await got(book.coverUrl.replace('http://', 'https://'), {
                        responseType: 'buffer',
                        headers: { 'User-Agent': 'Mozilla/5.0' },
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

        results.forEach(result => {
            if (result.status !== 'fulfilled' || !result.value) return;
            const { status, book, imageAsset, existingBook } = result.value;
            if (status === 'skipped') return;

            // --- UPDATED: Patch existing documents with cover and/or description if missing ---
            if (existingBook) {
                const patchData = {};
                if (!existingBook.hasCover && imageAsset) {
                    patchData.coverImage = { _type: 'image', asset: { _type: 'reference', _ref: imageAsset._id } };
                }
                if (!existingBook.hasDescription && book.description) {
                    patchData.bookDescription = stripHtml(book.description);
                }

                if (Object.keys(patchData).length > 0) {
                    transaction.patch(existingBook.id, { set: patchData });
                }
            } else { // --- UPDATED: Create new documents with description ---
                const newDoc = {
                    _type: 'bookReview',
                    title: book.title,
                    author: book.author,
                    // --- NEW: Add book description to new document ---
                    bookDescription: stripHtml(book.description),
                    slug: { _type: 'slug', current: slugify(book.title) },
                    yourRating: 3,
                    yourReview: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Write your review here...' }] }],
                    ...(imageAsset && { coverImage: { _type: 'image', asset: { _type: 'reference', _ref: imageAsset._id } } }),
                };
                transaction.create(newDoc);
            }
        });

        if (transaction.operations.length === 0) {
            return res.status(200).json({ message: 'Sync complete. No changes were needed.' });
        }
        await transaction.commit();
        res.status(200).json({ message: 'Books synced successfully.', operations: transaction.operations.length });
    } catch (error) {
        console.error('--- SERVERLESS FUNCTION ERROR ---', error);
        res.status(500).json({ error: error.message });
    }
};

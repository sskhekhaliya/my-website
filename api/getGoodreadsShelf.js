const fetch = require('node-fetch');
const xml2js = require('xml2js');

module.exports = async (req, res) => {
    const { shelf } = req.query;
    // Use the same environment variable check as the sync script for consistency
    const userId = process.env.GOODREADS_USER_ID || process.env.REACT_APP_GOODREADS_USER_ID;

    if (!shelf || !userId) {
        return res.status(400).json({ error: 'Shelf and User ID are required.' });
    }

    const RSS_URL = `https://www.goodreads.com/review/list_rss/${userId}?shelf=${shelf}`;

    try {
        const response = await fetch(RSS_URL);
        if (!response.ok) {
            console.error(`--- Goodreads RSS fetch failed for shelf "${shelf}" with status: ${response.status} ${response.statusText} ---`);
            throw new Error(`Failed to fetch Goodreads RSS feed: ${response.statusText}`);
        }
        const xml = await response.text();
        
        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(xml);
        
        const items = result.rss.channel.item;
        
        const books = (Array.isArray(items) ? items : [items]).map(item => {
            // Prioritize the large image URL, with fallbacks
            const baseUrl = item.book_large_image_url || item.book_medium_image_url || item.book_image_url || null;
            
            // Remove Goodreads's image size specifier to get the highest resolution version
            const highResUrl = baseUrl ? baseUrl.replace(/\._S[XY]\d+(_)?/, '') : null;
            
            console.log(`[DEBUG] Cover URL for "${item.title}": ${highResUrl}`);

            return {
                title: item.title,
                author: item.author_name,
                coverUrl: highResUrl, // Use the direct, high-res Goodreads URL
            };
        });

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(books);
    } catch (error) {
        console.error('--- Get Goodreads Shelf ERROR ---', error);
        res.status(500).json({ error: 'Failed to fetch or parse RSS feed.' });
    }
};


const fetch = require('node-fetch');
const xml2js = require('xml2js');

module.exports = async (req, res) => {
    const { shelf } = req.query;
    const userId = process.env.GOODREADS_USER_ID;

    if (!shelf || !userId) {
        console.error('Missing shelf or userId:', { shelf, userId });
        return res.status(400).json({ error: 'Shelf and User ID are required.' });
    }
    console.log("Shelf:", shelf, "UserID from env:", process.env.GOODREADS_USER_ID);


    const RSS_URL = `https://www.goodreads.com/review/list_rss/${userId}?shelf=${shelf}`;

    try {
        const response = await fetch(RSS_URL);
        const xml = await response.text();
        
        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(xml);
        
        const items = result.rss.channel.item;
        const books = Array.isArray(items) ? items.map(item => ({
            title: item.title,
            author: item.author_name,
        })) : [{
            title: items.title,
            author: items.author_name,
        }];

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch or parse RSS feed.' });
    }
};
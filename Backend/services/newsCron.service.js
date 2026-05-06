import cron from 'node-cron';
import Parser from 'rss-parser';
import axios from 'axios';
import * as cheerio from 'cheerio'; // You'll need: npm install cheerio
import News from '../models/news.model.js';
import { processNewsWithAI } from './geminiNews.service.js';

const parser = new Parser();

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// Helper to get actual text from the PIB link
async function scrapePIBContent(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        // PIB releases usually put main content in a div with class 'ReleaseText' or 'innner_text'
        const content = $('.ReleaseText').text() || $('.innner_text').text() || $('body').text();
        return content.trim().substring(0, 2000); // Limit to 2000 chars for AI efficiency
    } catch (error) {
        console.error("Scraping failed for:", url);
        return null;
    }
}

export const startNewsCron = async () => {
    console.log("⏰ PIB Fetcher started...");
    try {
        const feed = await parser.parseURL('https://www.pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3&reg=3');

        for (const item of feed.items.slice(0, 5)) {
            const exists = await News.findOne({ originalLink: item.link });
            
            if (!exists) {
                // console.log(`🔍 Processing: ${item.title}`);
                await sleep(2000);
                // 1. Fix the Date Error: Fallback to current time since XML is missing <pubDate>
                const pubDate = new Date(); 

                // 2. Fetch the actual content from the link
                const fullContent = await scrapePIBContent(item.link);

                if (fullContent) {
                    // 3. Let AI categorize and summarize
                    const aiData = await processNewsWithAI(item.title, fullContent);

                    if (aiData) {
                        await News.create({
                            source: 'PIB',
                            originalLink: item.link,
                            publishedAt: pubDate, // Validated
                            category: aiData.category,
                            state: aiData.state,
                            content: aiData.content
                        });
                        // console.log(`✅ Successfully saved: ${item.title}`);
                    }
                }
            }
        }
    } catch (error) {
        console.error("❌ Cron Job Error:", error.message);
    }
};


cron.schedule('0 0 * * *', startNewsCron);
import { EventRegistry, QueryArticles, ReturnInfo, ArticleInfoFlags } from 'eventregistry';
import News from '../models/news.model.js';
import cron from 'node-cron';
import { processNewsWithAI } from './geminiNews.service.js';
import dotenv from 'dotenv';
dotenv.config();

const er = new EventRegistry({ apiKey: process.env.NEWSAPI_AI_KEY });

let isRunning = false;

export const startNewsAPIaiCron = async () => {
    if (isRunning) {
        console.log("⏳ Fetch already running. Skipping.");
        return;
    }

    isRunning = true;

    try {
        console.log("🚀 NewsAPI.ai Fetcher started...");

        const indiaUri = await er.getLocationUri("India");

        const q = new QueryArticles(er, {
            sourceLocationUri: indiaUri,
            lang: "eng",
            dataType: ["news"],
            keywords: "\"government scheme\"",
            maxItems: 10
        });


        const articlesIter = new QueryArticlesIter(er, q, {
            maxItems: 10
        });

        console.log({
    page: articlesIter.page,
    maxItems: articlesIter.maxItems,
    sortBy: articlesIter.sortBy
});
        const tasks = [];

        for await (const article of articlesIter) {
            tasks.push(processArticle(article));
        }

        // console.log(tasks);


        await Promise.all(tasks);

        console.log("🏁 NewsAPI.ai Fetch cycle complete.");
    } catch (error) {
        console.error("❌ NewsAPI.ai Error:", error.message);
    } finally {
        isRunning = false;
    }
};

async function processArticle(article) {
    try {
        if (!article.body || article.body.length < 80) return;

        const exists = await News.findOne({ originalLink: article.url });
        if (exists) return;

        console.log(`🆕 Processing: ${article.title}`);

        const data = await processNewsWithAI(article.title, article.body);

        await News.create({
            source: article.source?.uri || "NewsAPI.ai",
            originalLink: article.url,
            publishedAt: new Date(article.dateTime),
            category: article.categories?.[0]?.label ?? "General",
            content: {
                title: article.title,
                summary: data || "No summary available",
            },
            state: "India"
        });

        console.log(`✅ Saved: ${article.title}`);
    } catch (err) {
        console.error("Processing Error:", err.message);
    }
}

// // Run immediately for testing
// cron.schedule('* * * * *', startNewsAPIaiCron);
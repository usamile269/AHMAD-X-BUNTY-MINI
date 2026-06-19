const { cmd } = require('../ahmad');
const yts = require('yt-search');
const axios = require('axios');
const { fakevCard } = require('../lib/fakevCard');

const FOOTER = `\n‎╔ஜ۩▒█ *ᴀʜᴍᴀᴅ X ᴍᴅ* █▒۩ஜ╗\n‎*|* 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 *ᴀʜᴍᴀᴅ-ᴍᴅ* \n‎*╰━━━━━━━━━━━━━━━━━━⊷*`;

async function resolveVideo(query) {
    if (query.includes("youtube.com") || query.includes("youtu.be")) {
        const info = await yts({ videoId: query.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1] || "" }).catch(() => null);
        if (info) return { url: query, title: info.title, thumbnail: info.thumbnail, timestamp: info.timestamp, views: info.views };
        return { url: query, title: "YouTube Video", thumbnail: null, timestamp: "N/A", views: 0 };
    }
    const search = await yts(query);
    if (!search.videos?.length) return null;
    const v = search.videos[0];
    return { url: v.url, title: v.title, thumbnail: v.thumbnail, timestamp: v.timestamp, views: v.views, author: v.author?.name };
}

// ===== YT VIDEO DOWNLOAD =====
cmd({
    pattern: "ytvideo",
    alias: ["ytv", "ytmp4", "youtube"],
    react: "🎬",
    desc: "Download YouTube video by link or search query",
    category: "downloader",
    use: ".ytvideo <link or search term>",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const query = args.join(" ");
        if (!query) return reply("❌ Provide a YouTube link or search term.\n\nExample: .ytvideo Pasoori");

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const video = await resolveVideo(query);
        if (!video) return reply("❌ No results found.");

        const apiUrl = `https://ahmad-apis-v2.vercel.app/download/ytmp4?url=${encodeURIComponent(video.url)}`;
        const { data } = await axios.get(apiUrl, { timeout: 60000 });

        const dlUrl = data?.result?.download?.url;
        if (!dlUrl) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ Could not generate video download. Try a shorter video.");
        }

        await conn.sendMessage(from, {
            video: { url: dlUrl },
            mimetype: "video/mp4",
            caption: `🎬 *${video.title}*\n👁️ Views: ${video.views || "N/A"}\n⏱️ Duration: ${video.timestamp || "N/A"}${FOOTER}`
        }, { quoted: fakevCard });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
    } catch (e) {
        console.error("YT Video Error:", e);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("❌ Download failed. Try again later or with a different video.");
    }
});

// ===== YT AUDIO DOWNLOAD (clean rebuild, separate from old song.js) =====
cmd({
    pattern: "ytmp3",
    alias: ["ytaudio", "ysong"],
    react: "🎧",
    desc: "Download YouTube audio by link or search query",
    category: "downloader",
    use: ".ytmp3 <link or search term>",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const query = args.join(" ");
        if (!query) return reply("❌ Provide a YouTube link or search term.\n\nExample: .ytmp3 Pasoori");

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const video = await resolveVideo(query);
        if (!video) return reply("❌ No results found.");

        const apiUrl = `https://ahmad-apis-v2.vercel.app/download/ytmp3?url=${encodeURIComponent(video.url)}`;
        const { data } = await axios.get(apiUrl, { timeout: 60000 });

        const dlUrl = data?.result?.download?.url;
        if (!dlUrl) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ Could not generate audio. Try again later.");
        }

        await conn.sendMessage(from, {
            audio: { url: dlUrl },
            mimetype: "audio/mpeg",
            fileName: `${video.title || "audio"}.mp3`,
            caption: `🎧 *${video.title}*${FOOTER}`
        }, { quoted: fakevCard });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
    } catch (e) {
        console.error("YT MP3 Error:", e);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("❌ Download failed. Try again later.");
    }
});

// ===== YT SEARCH (no download, just info) =====
cmd({
    pattern: "ytsearch",
    alias: ["yts"],
    react: "🔍",
    desc: "Search YouTube and show top 5 results",
    category: "downloader",
    use: ".ytsearch <term>",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const query = args.join(" ");
        if (!query) return reply("❌ Provide a search term.\n\nExample: .ytsearch lofi beats");

        await conn.sendMessage(from, { react: { text: '🔍', key: m.key } });

        const search = await yts(query);
        if (!search.videos?.length) return reply("❌ No results found.");

        const top = search.videos.slice(0, 5);
        let text = `🔍 *YOUTUBE SEARCH:* ${query}\n\n`;
        top.forEach((v, i) => {
            text += `${i + 1}. *${v.title}*\n   ⏱️ ${v.timestamp} | 👁️ ${v.views.toLocaleString()}\n   🔗 ${v.url}\n\n`;
        });
        text += `_Reply with .ytvideo <link> or .ytmp3 <link> to download_${FOOTER}`;

        reply(text);
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
    } catch (e) {
        console.error("YT Search Error:", e);
        reply("❌ Search failed.");
    }
});

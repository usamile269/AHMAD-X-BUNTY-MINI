const axios = require("axios");
const { cmd } = require('../ahmad');
const { fakevCard } = require('../lib/fakevCard');

const FOOTER = `\n‎╔ஜ۩▒█ *ᴀʜᴍᴀᴅ X ᴍᴅ* █▒۩ஜ╗\n‎*|* 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 *ᴀʜᴍᴀᴅ-ᴍᴅ* \n‎*╰━━━━━━━━━━━━━━━━━━⊷*`;

cmd({
    pattern: "tiktok",
    alias: ["tt", "ttdl", "tiktokdl"],
    react: "🎵",
    desc: "Download TikTok video without watermark",
    category: "downloader",
    use: ".tiktok <TikTok URL>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        const url = q || m.quoted?.text;
        if (!url || !url.includes("tiktok.com")) {
            return reply("❌ Please provide a valid TikTok link.\n\nExample:\n.tiktok https://vt.tiktok.com/xxxxx/");
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // Primary API - tikwm (no watermark, reliable, free)
        const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
        const { data } = await axios.get(apiUrl, { timeout: 30000 });

        if (!data || data.code !== 0 || !data.data) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ Failed to fetch video. Link may be invalid or private.");
        }

        const info = data.data;
        const videoUrl = `https://www.tikwm.com${info.play}`;
        const caption = `*_ᴛɪᴋᴛᴏᴋ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ_*

*👤 Author:* ${info.author?.nickname || "Unknown"}
*📝 Title:* ${info.title || "No title"}
*❤️ Likes:* ${info.digg_count ?? 0} | *💬 Comments:* ${info.comment_count ?? 0}
*🔁 Shares:* ${info.share_count ?? 0} | *▶️ Plays:* ${info.play_count ?? 0}
${FOOTER}`;

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: "video/mp4",
            caption
        }, { quoted: fakevCard });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
    } catch (error) {
        console.error('TikTok DL Error:', error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("❌ Download failed. Try again later.");
    }
});

cmd({
    pattern: "ttaudio",
    alias: ["tiktokmp3", "ttmp3", "tiktokaudio"],
    react: "🎧",
    desc: "Download TikTok audio/music only",
    category: "downloader",
    use: ".ttaudio <TikTok URL>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        const url = q || m.quoted?.text;
        if (!url || !url.includes("tiktok.com")) {
            return reply("❌ Please provide a valid TikTok link.\n\nExample:\n.ttaudio https://vt.tiktok.com/xxxxx/");
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
        const { data } = await axios.get(apiUrl, { timeout: 30000 });

        if (!data || data.code !== 0 || !data.data?.music) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ Failed to fetch audio. Link may be invalid or private.");
        }

        const info = data.data;

        await conn.sendMessage(from, {
            audio: { url: info.music },
            mimetype: "audio/mpeg",
            fileName: `${info.title || "tiktok-audio"}.mp3`
        }, { quoted: fakevCard });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
    } catch (error) {
        console.error('TikTok Audio Error:', error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("❌ Download failed. Try again later.");
    }
});

const axios = require("axios");
const { cmd } = require('../ahmad');
const { fakevCard } = require('../lib/fakevCard');

const FOOTER = `\n‎╔ஜ۩▒█ *ᴀʜᴍᴀᴅ X ᴍᴅ* █▒۩ஜ╗\n‎*|* 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 *ᴀʜᴍᴀᴅ-ᴍᴅ* \n‎*╰━━━━━━━━━━━━━━━━━━⊷*`;

cmd({
    pattern: "igreel",
    alias: ["reel", "igvideo"],
    react: "📸",
    desc: "Download Instagram reels/posts/videos (multi-item supported)",
    category: "downloader",
    use: ".igreel <Instagram URL>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        const url = q || m.quoted?.text;
        if (!url || !url.includes("instagram.com")) {
            return reply("❌ Please provide a valid Instagram link.\n\nExample:\n.igreel https://instagram.com/reel/xxxxx/");
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
        let items = [];

        // Try primary source first
        try {
            const { data } = await axios.get(
                `https://api-aswin-sparky.koyeb.app/api/downloader/igdl?url=${encodeURIComponent(url)}`,
                { timeout: 20000 }
            );
            if (data?.status && data.data?.length) {
                items = data.data.map(d => ({ url: d.url, type: d.type }));
            }
        } catch (_) { /* fall through to backup */ }

        // Backup source
        if (!items.length) {
            const { data } = await axios.get(
                `https://bk9.fun/download/instagram?url=${encodeURIComponent(url)}`,
                { timeout: 20000 }
            );
            if (data?.status && data.BK9?.length) {
                items = data.BK9.map(d => ({ url: d.url, type: d.url?.includes(".mp4") ? "video" : "image" }));
            }
        }

        if (!items.length) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ Failed to fetch media. Link may be invalid or the account is private.");
        }

        for (const item of items) {
            await conn.sendMessage(from, {
                [item.type === 'video' ? 'video' : 'image']: { url: item.url },
                caption: `*_ɪɴsᴛᴀɢʀᴀᴍ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ_*${FOOTER}`
            }, { quoted: fakevCard });
        }

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
    } catch (error) {
        console.error('IG Reel DL Error:', error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("❌ Download failed. Try again later.");
    }
});

cmd({
    pattern: "igstory",
    alias: ["storydl"],
    react: "📷",
    desc: "Download Instagram story by username (public accounts only)",
    category: "downloader",
    use: ".igstory <username>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❌ Please provide an Instagram username.\n\nExample:\n.igstory username");

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const apiUrl = `https://bk9.fun/download/igstory?username=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl, { timeout: 20000 });

        if (!data?.status || !data.BK9?.length) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ No active stories found, or account is private.");
        }

        for (const item of data.BK9) {
            await conn.sendMessage(from, {
                [item.type === 'video' ? 'video' : 'image']: { url: item.url },
                caption: `*_ɪɴsᴛᴀɢʀᴀᴍ sᴛᴏʀʏ_*${FOOTER}`
            }, { quoted: fakevCard });
        }

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
    } catch (error) {
        console.error('IG Story DL Error:', error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("❌ Download failed. Try again later.");
    }
});

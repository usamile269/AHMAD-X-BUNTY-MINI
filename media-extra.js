const { cmd } = require('../ahmad');
const axios = require('axios');
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const { fakevCard } = require('../lib/fakevCard');

const FOOTER = `\n‎╔ஜ۩▒█ *ᴀʜᴍᴀᴅ X ᴍᴅ* █▒۩ஜ╗\n‎*|* 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 *ᴀʜᴍᴀᴅ-ᴍᴅ* \n‎*╰━━━━━━━━━━━━━━━━━━⊷*`;

// ===== IMG2STICKER FROM URL =====
cmd({
    pattern: "stickerlink",
    alias: ["urlsticker"],
    react: "🔗",
    desc: "Make sticker from an image URL",
    category: "sticker",
    use: ".stickerlink <image url>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || !q.startsWith("http")) return reply("⚠️ Provide a valid image URL.\n\nExample:\n.stickerlink https://example.com/pic.jpg");

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const { data } = await axios.get(q, { responseType: 'arraybuffer' });
        const sticker = new Sticker(Buffer.from(data), {
            pack: "Ahmad-MD",
            author: "Ahmad MD Bot",
            type: StickerTypes.FULL,
            quality: 70
        });

        const buffer = await sticker.toBuffer();
        await conn.sendMessage(from, { sticker: buffer }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
    } catch (e) {
        console.error(e);
        reply("❌ Failed to create sticker from URL.");
    }
});

// ===== EMOJI MIX (combine two emojis into a sticker) =====
cmd({
    pattern: "emojimix",
    alias: ["emix"],
    react: "🎭",
    desc: "Mix two emojis into one sticker",
    category: "sticker",
    use: ".emojimix 😎+🔥",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || !q.includes("+")) return reply("⚠️ Usage: .emojimix 😎+🔥");

        const [e1, e2] = q.split("+").map(e => e.trim());
        if (!e1 || !e2) return reply("⚠️ Usage: .emojimix 😎+🔥");

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const apiUrl = `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v6&q=${encodeURIComponent(e1)}_${encodeURIComponent(e2)}`;
        const { data } = await axios.get(apiUrl, { timeout: 20000 });

        const url = data?.results?.[0]?.media_formats?.png_transparent?.url;
        if (!url) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ That emoji combo isn't supported. Try a different pair.");
        }

        const { data: imgData } = await axios.get(url, { responseType: 'arraybuffer' });
        const sticker = new Sticker(Buffer.from(imgData), {
            pack: "Ahmad-MD",
            author: "Emoji Mix",
            type: StickerTypes.FULL,
            quality: 70
        });

        const buffer = await sticker.toBuffer();
        await conn.sendMessage(from, { sticker: buffer }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
    } catch (e) {
        console.error(e);
        reply("❌ Emoji mix failed. Try a different combo.");
    }
});

// ===== TOAUDIO (video/sticker -> audio) =====
cmd({
    pattern: "toaudio",
    alias: ["tomp3"],
    react: "🎵",
    desc: "Extract audio from a video",
    category: "media",
    use: ".toaudio (reply to video)",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || "";
        if (!/video/.test(mime)) return reply("⚠️ Reply to a video with .toaudio");

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const media = await q.download();
        if (!media) return reply("❌ Media download failed.");

        await conn.sendMessage(from, {
            audio: media,
            mimetype: "audio/mpeg",
            fileName: "audio.mp3"
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
    } catch (e) {
        console.error(e);
        reply("❌ Failed to extract audio.");
    }
});

// ===== SAVE/REPOST STATUS-LIKE MEDIA AS DOCUMENT =====
cmd({
    pattern: "tofile",
    alias: ["todoc", "asdocument"],
    react: "📄",
    desc: "Send replied media as a file/document",
    category: "media",
    use: ".tofile (reply to image/video/audio)",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || "";
        if (!mime) return reply("⚠️ Reply to a media message with .tofile");

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const media = await q.download();
        if (!media) return reply("❌ Media download failed.");

        const ext = mime.split("/")[1]?.split(";")[0] || "bin";

        await conn.sendMessage(from, {
            document: media,
            mimetype: mime,
            fileName: `ahmad-md-file.${ext}`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
    } catch (e) {
        console.error(e);
        reply("❌ Failed to convert to file.");
    }
});

const { cmd } = require("../ahmad")
const { Sticker, StickerTypes } = require("wa-sticker-formatter")
const { getBuffer } = require("../lib/functions")
const fs = require("fs")
const path = require("path")

// ===== STICKER (image/video -> sticker) =====
cmd({
    pattern: "sticker",
    alias: ["s", "stiker"],
    react: "🎨",
    desc: "Convert image/video to sticker",
    category: "sticker",
    use: ".sticker (reply to image/video)",
    filename: __filename
},
async (conn, mek, m, { from, reply, quoted }) => {
    try {
        const q = m.quoted ? m.quoted : m
        const mime = (q.msg || q).mimetype || ""
        if (!/image|video/.test(mime)) return reply("*Image ya video pe reply karo (.sticker)*")

        const media = await q.download()
        if (!media) return reply("❌ Media download nahi hua")

        const sticker = new Sticker(media, {
            pack: "Ahmad-MD",
            author: "Ahmad MD Bot",
            type: StickerTypes.FULL,
            quality: 70
        })

        const buffer = await sticker.toBuffer()
        await conn.sendMessage(from, { sticker: buffer }, { quoted: mek })
    } catch (e) {
        reply(`❌ Error: ${e.message || e}`)
    }
})

// ===== TOIMG (sticker -> image) =====
cmd({
    pattern: "toimg",
    alias: ["simage", "stickertoimg"],
    react: "🖼️",
    desc: "Convert sticker to image",
    category: "sticker",
    use: ".toimg (reply to sticker)",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const q = m.quoted ? m.quoted : m
        const mime = (q.msg || q).mimetype || ""
        if (!/webp/.test(mime)) return reply("*Sticker pe reply karo (.toimg)*")

        const media = await q.download()
        if (!media) return reply("❌ Media download nahi hua")

        await conn.sendMessage(from, { image: media, caption: "✅ Converted to image" }, { quoted: mek })
    } catch (e) {
        reply(`❌ Error: ${e.message || e}`)
    }
})

// ===== SMETA (custom sticker pack name/author) =====
cmd({
    pattern: "smeta",
    alias: ["spack"],
    react: "🏷️",
    desc: "Sticker with custom pack name and author",
    category: "sticker",
    use: ".smeta packname|author (reply to image/video)",
    filename: __filename
},
async (conn, mek, m, { from, reply, args, body, command }) => {
    try {
        const q = m.quoted ? m.quoted : m
        const mime = (q.msg || q).mimetype || ""
        if (!/image|video/.test(mime)) return reply("*Image ya video pe reply karo*")

        const text = body.slice(body.indexOf(command) + command.length).trim()
        const [pack, author] = text.split("|").map(s => (s || "").trim())

        const media = await q.download()
        if (!media) return reply("❌ Media download nahi hua")

        const sticker = new Sticker(media, {
            pack: pack || "Ahmad-MD",
            author: author || "Ahmad MD Bot",
            type: StickerTypes.FULL,
            quality: 70
        })

        const buffer = await sticker.toBuffer()
        await conn.sendMessage(from, { sticker: buffer }, { quoted: mek })
    } catch (e) {
        reply(`❌ Error: ${e.message || e}`)
    }
})

// ===== CIRCLE STICKER =====
cmd({
    pattern: "circle",
    alias: ["csticker"],
    react: "⭕",
    desc: "Make a circular cropped sticker",
    category: "sticker",
    use: ".circle (reply to image)",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const q = m.quoted ? m.quoted : m
        const mime = (q.msg || q).mimetype || ""
        if (!/image/.test(mime)) return reply("*Image pe reply karo (.circle)*")

        const media = await q.download()
        if (!media) return reply("❌ Media download nahi hua")

        const sticker = new Sticker(media, {
            pack: "Ahmad-MD",
            author: "Ahmad MD Bot",
            type: StickerTypes.CROPPED,
            quality: 70
        })

        const buffer = await sticker.toBuffer()
        await conn.sendMessage(from, { sticker: buffer }, { quoted: mek })
    } catch (e) {
        reply(`❌ Error: ${e.message || e}`)
    }
})

// ===== TAKE (steal sticker, re-pack) =====
cmd({
    pattern: "take",
    alias: ["steal"],
    react: "📥",
    desc: "Re-pack a sticker with your own name",
    category: "sticker",
    use: ".take packname|author (reply to sticker)",
    filename: __filename
},
async (conn, mek, m, { from, reply, body, command }) => {
    try {
        const q = m.quoted ? m.quoted : m
        const mime = (q.msg || q).mimetype || ""
        if (!/webp/.test(mime)) return reply("*Sticker pe reply karo (.take)*")

        const text = body.slice(body.indexOf(command) + command.length).trim()
        const [pack, author] = text.split("|").map(s => (s || "").trim())

        const media = await q.download()
        if (!media) return reply("❌ Media download nahi hua")

        const sticker = new Sticker(media, {
            pack: pack || "Ahmad-MD",
            author: author || "Ahmad MD Bot",
            type: StickerTypes.FULL,
            quality: 70
        })

        const buffer = await sticker.toBuffer()
        await conn.sendMessage(from, { sticker: buffer }, { quoted: mek })
    } catch (e) {
        reply(`❌ Error: ${e.message || e}`)
    }
})

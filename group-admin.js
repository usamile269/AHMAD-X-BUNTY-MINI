const { cmd } = require('../ahmad');
const { fakevCard } = require('../lib/fakevCard');

const FOOTER = `\n‎╔ஜ۩▒█ *ᴀʜᴍᴀᴅ X ᴍᴅ* █▒۩ஜ╗\n‎*|* 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 *ᴀʜᴍᴀᴅ-ᴍᴅ* \n‎*╰━━━━━━━━━━━━━━━━━━⊷*`;

function getTargets(m, args) {
    // mentioned users
    const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (mentioned.length) return mentioned;
    // replied user
    const quotedParticipant = m.message?.extendedTextMessage?.contextInfo?.participant;
    if (quotedParticipant) return [quotedParticipant];
    // raw number passed as arg
    if (args[0]) {
        const num = args[0].replace(/[^0-9]/g, '');
        if (num) return [`${num}@s.whatsapp.net`];
    }
    return [];
}

// Note: .kick, .add, .promote, .demote are handled by gc-setting.js to avoid duplicate command conflicts.

// ===== GROUP MUTE / UNMUTE (close/open) =====
cmd({
    pattern: "mute",
    alias: ["close", "groupclose"],
    desc: "Only admins can send messages",
    category: "group",
    react: "🔇",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    if (!isGroup) return reply("❌ This command works only in groups.");
    if (!isAdmins) return reply("❌ Only group admins can use this command.");
    if (!isBotAdmins) return reply("❌ I need to be admin to do this.");
    try {
        await conn.groupSettingUpdate(from, 'announcement');
        reply(`🔇 Group muted. Only admins can send messages.${FOOTER}`);
    } catch (e) {
        reply("❌ Failed to mute group.");
    }
});

cmd({
    pattern: "unmute",
    alias: ["open", "groupopen"],
    desc: "All members can send messages",
    category: "group",
    react: "🔊",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    if (!isGroup) return reply("❌ This command works only in groups.");
    if (!isAdmins) return reply("❌ Only group admins can use this command.");
    if (!isBotAdmins) return reply("❌ I need to be admin to do this.");
    try {
        await conn.groupSettingUpdate(from, 'not_announcement');
        reply(`🔊 Group unmuted. Everyone can send messages.${FOOTER}`);
    } catch (e) {
        reply("❌ Failed to unmute group.");
    }
});

// ===== GROUP LOCK / UNLOCK (edit info) =====
cmd({
    pattern: "lockgc",
    desc: "Only admins can edit group info (name, icon, description)",
    category: "group",
    react: "🔒",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    if (!isGroup) return reply("❌ This command works only in groups.");
    if (!isAdmins) return reply("❌ Only group admins can use this command.");
    if (!isBotAdmins) return reply("❌ I need to be admin to do this.");
    try {
        await conn.groupSettingUpdate(from, 'locked');
        reply(`🔒 Group info locked. Only admins can edit.${FOOTER}`);
    } catch (e) {
        reply("❌ Failed to lock group.");
    }
});

cmd({
    pattern: "unlockgc",
    desc: "All members can edit group info",
    category: "group",
    react: "🔓",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    if (!isGroup) return reply("❌ This command works only in groups.");
    if (!isAdmins) return reply("❌ Only group admins can use this command.");
    if (!isBotAdmins) return reply("❌ I need to be admin to do this.");
    try {
        await conn.groupSettingUpdate(from, 'unlocked');
        reply(`🔓 Group unlocked. Everyone can edit info.${FOOTER}`);
    } catch (e) {
        reply("❌ Failed to unlock group.");
    }
});

// ===== GROUP INVITE LINK =====
cmd({
    pattern: "glink",
    alias: ["grouplink", "invitelink"],
    desc: "Get group invite link",
    category: "group",
    react: "🔗",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, reply }) => {
    if (!isGroup) return reply("❌ This command works only in groups.");
    if (!isAdmins) return reply("❌ Only group admins can use this command.");
    try {
        const code = await conn.groupInviteCode(from);
        reply(`🔗 *Group Invite Link:*\nhttps://chat.whatsapp.com/${code}${FOOTER}`);
    } catch (e) {
        reply("❌ Failed to fetch invite link. I need to be admin.");
    }
});

cmd({
    pattern: "revoke",
    alias: ["resetlink"],
    desc: "Reset group invite link (revokes old link)",
    category: "group",
    react: "♻️",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    if (!isGroup) return reply("❌ This command works only in groups.");
    if (!isAdmins) return reply("❌ Only group admins can use this command.");
    if (!isBotAdmins) return reply("❌ I need to be admin to do this.");
    try {
        const code = await conn.groupRevokeInvite(from);
        reply(`♻️ Link reset!\n🔗 New link:\nhttps://chat.whatsapp.com/${code}${FOOTER}`);
    } catch (e) {
        reply("❌ Failed to reset invite link.");
    }
});

// ===== SET GROUP NAME / DESC =====
cmd({
    pattern: "setgname",
    alias: ["setname"],
    desc: "Change group name",
    category: "group",
    react: "✏️",
    use: ".setgname New Group Name",
    filename: __filename
}, async (conn, mek, m, { from, q, isGroup, isAdmins, isBotAdmins, reply }) => {
    if (!isGroup) return reply("❌ This command works only in groups.");
    if (!isAdmins) return reply("❌ Only group admins can use this command.");
    if (!isBotAdmins) return reply("❌ I need to be admin to do this.");
    if (!q) return reply("⚠️ Give a new group name.\n\nExample: .setgname My Awesome Group");
    try {
        await conn.groupUpdateSubject(from, q);
        reply(`✅ Group name updated to: *${q}*${FOOTER}`);
    } catch (e) {
        reply("❌ Failed to update group name.");
    }
});

cmd({
    pattern: "setgdesc",
    alias: ["setdesc"],
    desc: "Change group description",
    category: "group",
    react: "📝",
    use: ".setgdesc New description here",
    filename: __filename
}, async (conn, mek, m, { from, q, isGroup, isAdmins, isBotAdmins, reply }) => {
    if (!isGroup) return reply("❌ This command works only in groups.");
    if (!isAdmins) return reply("❌ Only group admins can use this command.");
    if (!isBotAdmins) return reply("❌ I need to be admin to do this.");
    if (!q) return reply("⚠️ Give a new group description.");
    try {
        await conn.groupUpdateDescription(from, q);
        reply(`✅ Group description updated.${FOOTER}`);
    } catch (e) {
        reply("❌ Failed to update group description.");
    }
});

// ===== GROUP INFO =====
cmd({
    pattern: "ginfo",
    alias: ["groupinfo"],
    desc: "Show group information",
    category: "group",
    react: "ℹ️",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, groupMetadata, groupAdmins, reply }) => {
    if (!isGroup) return reply("❌ This command works only in groups.");
    try {
        const meta = groupMetadata || await conn.groupMetadata(from);
        const info = `*ℹ️ GROUP INFO*

*📛 Name:* ${meta.subject}
*🆔 ID:* ${meta.id}
*👥 Members:* ${meta.participants.length}
*👮 Admins:* ${(groupAdmins || []).length}
*📅 Created:* ${meta.creation ? new Date(meta.creation * 1000).toLocaleDateString() : "Unknown"}
*📝 Description:* ${meta.desc || "No description"}
${FOOTER}`;
        reply(info);
    } catch (e) {
        reply("❌ Failed to fetch group info.");
    }
});

// ===== WARN SYSTEM =====
const warnStore = {};

cmd({
    pattern: "warn",
    react: "⚠️",
    desc: "Warn a member (3 warns = auto kick)",
    category: "group",
    use: ".warn @user (or reply)",
    filename: __filename
}, async (conn, mek, m, { from, args, isGroup, isAdmins, isBotAdmins, reply }) => {
    if (!isGroup) return reply("❌ This command works only in groups.");
    if (!isAdmins) return reply("❌ Only group admins can use this command.");

    const targets = getTargets(m, args);
    if (!targets.length) return reply("⚠️ Tag or reply to a user to warn.");
    const target = targets[0];

    const key = from + "_" + target;
    warnStore[key] = (warnStore[key] || 0) + 1;

    if (warnStore[key] >= 3) {
        if (isBotAdmins) {
            await conn.groupParticipantsUpdate(from, [target], "remove");
            warnStore[key] = 0;
            return reply(`🚫 @${target.split("@")[0]} removed after 3 warnings.${FOOTER}`, { mentions: [target] });
        }
        return reply(`⚠️ @${target.split("@")[0]} has 3 warnings but I need admin to remove them.`, { mentions: [target] });
    }

    reply(`⚠️ @${target.split("@")[0]} warned (${warnStore[key]}/3)${FOOTER}`, { mentions: [target] });
});

cmd({
    pattern: "resetwarn",
    react: "♻️",
    desc: "Reset warnings of a member",
    category: "group",
    use: ".resetwarn @user (or reply)",
    filename: __filename
}, async (conn, mek, m, { from, args, isGroup, isAdmins, reply }) => {
    if (!isGroup) return reply("❌ This command works only in groups.");
    if (!isAdmins) return reply("❌ Only group admins can use this command.");

    const targets = getTargets(m, args);
    if (!targets.length) return reply("⚠️ Tag or reply to a user to reset warnings.");
    const target = targets[0];

    warnStore[from + "_" + target] = 0;
    reply(`✅ Warnings reset for @${target.split("@")[0]}${FOOTER}`, { mentions: [target] });
});

// ===== LEAVE GROUP =====
cmd({
    pattern: "leavegc",
    alias: ["leavegroup"],
    desc: "Bot leaves the current group (owner only)",
    category: "group",
    react: "🚪",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isOwner, reply }) => {
    if (!isGroup) return reply("❌ This command works only in groups.");
    if (!isOwner) return reply("❌ Only the bot owner can use this command.");
    try {
        await reply("👋 Goodbye! Bot is leaving this group.");
        await conn.groupLeave(from);
    } catch (e) {
        reply("❌ Failed to leave group.");
    }
});

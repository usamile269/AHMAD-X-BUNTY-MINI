const fs = require('fs');
const dotenv = require('dotenv');

if (fs.existsSync('.env')) {
    dotenv.config({ path: '.env' });
}

module.exports = {
    // ===========================================================
    // 1. BASE CONFIGURATION (Session & Database)
    // ===========================================================
    SESSION_ID: process.env.SESSION_ID || "MINI BOT", 
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://offahmad_db_user:ahmadmd@cluster0.xrqkzwg.mongodb.net/?appName=Cluster0',
    
    // ===========================================================
    // 2. BOT INFORMATION
    // ===========================================================
    PREFIX: process.env.PREFIX || '.',
    OWNER_NUMBER: process.env.OWNER_NUMBER || '+923044975027', // Put your number here
    BOT_NAME: "Ahmad MD Mini",
    BOT_FOOTER: '© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀʜᴍᴀᴅ-ᴍᴅ',
    
    // Work mode: public, private, group, inbox
    WORK_TYPE: process.env.WORK_TYPE || "public", 
    
    // ===========================================================
    // 3. AUTO FEATURES (STATUS)
    // ===========================================================
    AUTO_VIEW_STATUS: process.env.AUTO_VIEW_STATUS || 'true', // Auto view statuses
    AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS || 'true', // Auto like statuses
    AUTO_LIKE_EMOJI: ['❤️', '🌹', '✨', '🥰', '🌹', '😍', '💞', '💕', '☺️', '🤗'], 
    
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || 'false', // Reply to statuses
    AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || '🤗', // Reply message
    
    // ===========================================================
    // 4. CHAT & PRESENCE FEATURES
    // ===========================================================
    READ_MESSAGE: process.env.READ_MESSAGE || 'false', // Mark messages as read (Blue Tick)
    AUTO_TYPING: process.env.AUTO_TYPING || 'false', // Show "Typing..."
    AUTO_RECORDING: process.env.AUTO_RECORDING || 'false', // Show "Recording..."
    
    // ===========================================================
    // 5. GROUP MANAGEMENT
    // ===========================================================
    WELCOME_ENABLE: process.env.WELCOME_ENABLE || 'true',
    GOODBYE_ENABLE: process.env.GOODBYE_ENABLE || 'true',
    WELCOME_MSG: process.env.WELCOME_MSG || null, 
    GOODBYE_MSG: process.env.GOODBYE_MSG || null, 
    WELCOME_IMAGE: process.env.WELCOME_IMAGE || null, 
    GOODBYE_IMAGE: process.env.GOODBYE_IMAGE || null,
    
    GROUP_INVITE_LINK: process.env.GROUP_INVITE_LINK || 'https://chat.whatsapp.com/LQDL3chA5ZAKirFWz6I8KO?s=cl&p=a&mlu=2',
    
    // ===========================================================
    // 6. SECURITY & ANTI-CALL
    // ===========================================================
    ANTI_CALL: process.env.ANTI_CALL || 'false', // Reject calls
    REJECT_MSG: process.env.REJECT_MSG || '*CALL LATER PLEASE ☺️🌹*',
    
    // ===========================================================
    // 7. IMAGES & LINKS
    // ===========================================================
    IMAGE_PATH: 'https://image-link.edgeone.app/1781781559115-5fg0qz.jpg',
    CHANNEL_LINK: 'https://whatsapp.com/channel/0029VarfjW04tRrmwfb8x306',
    
    // ===========================================================
    // 8. EXTERNAL API (Optional)
    // ===========================================================
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '8762838727:AAFXgTPApZFpLwkjmR3MoD9vcpj83QE6iVg',
    TELEGRAM_CHAT_ID: process.env.  TELEGRAM_CHAT_ID || '923044975027'
    
};
  

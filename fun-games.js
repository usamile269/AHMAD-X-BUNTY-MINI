const { cmd } = require("../ahmad")

// ===== TRUTH =====
const truths = [
    "Aap ki sabse embarrassing memory kya hai?",
    "Aap ne kabhi kisi se jhoot bola hai? Konsa?",
    "Aap ka secret crush kon tha?",
    "Sabse buri aadat jo aap mein hai?",
    "Aap ne kabhi cheating ki hai exam mein?",
    "Aap ko apne aap mein sabse zyada kya pasand nahi?",
    "Aap ne kisi ka phone secretly check kiya hai?",
    "Sabse weird sapna jo aap ne dekha?",
    "Aap kabhi kisi se jealous huay hain? Kis se?",
    "Aap ki life ka sabse embarrassing moment?",
]

cmd({
    pattern: "truth",
    react: "😳",
    desc: "Get a random truth question",
    category: "fun",
    use: ".truth",
    filename: __filename
},
async (conn, mek, m, { reply }) => {
    const t = truths[Math.floor(Math.random() * truths.length)]
    reply(`🎭 *TRUTH*\n\n${t}`)
})

// ===== DARE =====
const dares = [
    "Apni last 5 WhatsApp chats ka screenshot group mein bhejo",
    "Apni voice note ek funny accent mein bhejo",
    "Apni profile picture 1 ghante ke liye change kardo kisi cartoon se",
    "Apne contact mein se kisi ko 'I love you' text karo (bina explain kiye)",
    "Apna current mood ek emoji mein batao, bina words use kiye",
    "Group mein apni embarrassing baby photo bhejo",
    "Ek minute tak sirf emojis mein baat karo",
    "Apne phone ka battery percentage screenshot bhejo",
    "Random contact ko call karke 'Pizza order kar diya?' bolo",
    "Apni status pe ye message 1 ghante ke liye lagao: 'Mujhe yeh game pasand hai'",
]

cmd({
    pattern: "dare",
    react: "🔥",
    desc: "Get a random dare challenge",
    category: "fun",
    use: ".dare",
    filename: __filename
},
async (conn, mek, m, { reply }) => {
    const d = dares[Math.floor(Math.random() * dares.length)]
    reply(`🔥 *DARE*\n\n${d}`)
})

// ===== QUIZ =====
const quizzes = [
    { q: "Pakistan ka sabse bara shehar kon sa hai?", a: "karachi" },
    { q: "Duniya ka sabse bara samandar kon sa hai?", a: "pacific" },
    { q: "Insan ke jism mein kitni haddiyan hoti hain?", a: "206" },
    { q: "Sooraj ke sabse qareeb planet kon sa hai?", a: "mercury" },
    { q: "HTML ka full form kya hai?", a: "hypertext markup language" },
    { q: "Pakistan ki azaadi kab mili?", a: "1947" },
    { q: "Duniya ka sabse bara mulk (area) kon sa hai?", a: "russia" },
    { q: "Ek saal mein kitne din hote hain?", a: "365" },
    { q: "WhatsApp kis company ka hai?", a: "meta" },
    { q: "JavaScript kis cheez ke liye use hota hai?", a: "programming" },
]

const activeQuiz = {}

cmd({
    pattern: "quiz",
    react: "🧠",
    desc: "Start a quiz question",
    category: "fun",
    use: ".quiz",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    const item = quizzes[Math.floor(Math.random() * quizzes.length)]
    activeQuiz[from] = item.a.toLowerCase()
    reply(`🧠 *QUIZ TIME*\n\n${item.q}\n\n_Reply with .answer <your answer>_`)
})

cmd({
    pattern: "answer",
    alias: ["ans"],
    react: "✅",
    desc: "Answer the active quiz",
    category: "fun",
    use: ".answer <text>",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    if (!activeQuiz[from]) return reply("*Koi active quiz nahi hai. Pehle .quiz likho*")
    const userAns = args.join(" ").toLowerCase().trim()
    if (!userAns) return reply("*Apna answer likho: .answer <text>*")

    if (userAns === activeQuiz[from]) {
        reply("✅ *Sahi jawab! Shabash 🎉*")
    } else {
        reply(`❌ *Galat jawab. Sahi jawab tha: ${activeQuiz[from]}*`)
    }
    delete activeQuiz[from]
})

// ===== FLIRT LINES =====
const flirts = [
    "Kya tum google maps ho? Kyun ke mujhe tum mein hamesha rasta mil jata hai 😏",
    "Agar tum ek vegetable hoti to tum a cute-cumber hoti 🥒",
    "Tumhara naam WiFi to nahi? Kyun ke mein connect feel kar raha hoon 📶",
    "Tum sun room jaisi ho, mujhe roshni dete ho ☀️",
    "Mera din tab perfect hota hai jab tum smile karti ho 😊",
]

cmd({
    pattern: "flirt",
    alias: ["pickup"],
    react: "😘",
    desc: "Random flirty pickup line",
    category: "fun",
    use: ".flirt",
    filename: __filename
},
async (conn, mek, m, { reply }) => {
    const f = flirts[Math.floor(Math.random() * flirts.length)]
    reply(`💘 ${f}`)
})

// ===== ROAST =====
const roasts = [
    "Tum itne special ho ke har AI bhi confuse ho jaye tumhe samajhne mein 😂",
    "Tumhari soch itni unique hai ke physics ke laws bhi follow nahi karti 🤡",
    "Tumhe dekh ke lagta hai Mother Nature bhi kabhi kabhi mazak karti hai 😂",
    "Tum proof ho ke evolution kabhi kabhi reverse bhi ho sakta hai 🐒",
    "Tum itne slow ho ke loading bar bhi tumse fast hai ⏳",
]

cmd({
    pattern: "roast",
    react: "🔥",
    desc: "Get a random roast (just for fun)",
    category: "fun",
    use: ".roast",
    filename: __filename
},
async (conn, mek, m, { reply }) => {
    const r = roasts[Math.floor(Math.random() * roasts.length)]
    reply(`🔥 ${r}\n\n_Just for fun, no offense! 😄_`)
})

// ===== COMPLIMENT =====
const compliments = [
    "Tum jaisa positive energy bohat kam logon mein hota hai ✨",
    "Tumhari smile literally kisi ka din bana sakti hai 😊",
    "Tum jo bhi karte ho, dil se karte ho — yeh quality rare hai 💯",
    "Tumhari soch bohat mature aur deep hai 🌟",
    "Log tumhare saath comfortable feel karte hain — yeh bohat bari baat hai ❤️",
]

cmd({
    pattern: "compliment",
    react: "💝",
    desc: "Get a random compliment",
    category: "fun",
    use: ".compliment",
    filename: __filename
},
async (conn, mek, m, { reply }) => {
    const c = compliments[Math.floor(Math.random() * compliments.length)]
    reply(`💝 ${c}`)
})

// ===== COINFLIP =====
cmd({
    pattern: "coinflip",
    alias: ["flip", "headstails"],
    react: "🪙",
    desc: "Flip a coin",
    category: "fun",
    use: ".coinflip",
    filename: __filename
},
async (conn, mek, m, { reply }) => {
    const result = Math.random() < 0.5 ? "Heads 🪙" : "Tails 🪙"
    reply(`🎲 *Result:* ${result}`)
})

// ===== DICE =====
cmd({
    pattern: "dice",
    alias: ["roll"],
    react: "🎲",
    desc: "Roll a dice",
    category: "fun",
    use: ".dice",
    filename: __filename
},
async (conn, mek, m, { reply }) => {
    const result = Math.floor(Math.random() * 6) + 1
    reply(`🎲 *Dice Roll:* ${result}`)
})

// ===== RPS (Rock Paper Scissors) =====
cmd({
    pattern: "rps",
    alias: ["rockpaperscissors"],
    react: "✂️",
    desc: "Play rock paper scissors vs bot",
    category: "fun",
    use: ".rps rock/paper/scissors",
    filename: __filename
},
async (conn, mek, m, { reply, args }) => {
    const choices = ["rock", "paper", "scissors"]
    const userChoice = (args[0] || "").toLowerCase()
    if (!choices.includes(userChoice)) return reply("*Use: .rps rock | paper | scissors*")

    const botChoice = choices[Math.floor(Math.random() * 3)]
    let result
    if (userChoice === botChoice) result = "🤝 Draw!"
    else if (
        (userChoice === "rock" && botChoice === "scissors") ||
        (userChoice === "paper" && botChoice === "rock") ||
        (userChoice === "scissors" && botChoice === "paper")
    ) result = "🎉 Aap jeet gaye!"
    else result = "🤖 Bot jeet gaya!"

    reply(`✊✋✌️ *Rock Paper Scissors*\n\nAapne: ${userChoice}\nBot ne: ${botChoice}\n\n${result}`)
})

// ===== MATH GAME =====
cmd({
    pattern: "math",
    alias: ["mathgame"],
    react: "🔢",
    desc: "Solve a quick math problem",
    category: "fun",
    use: ".math",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    const a = Math.floor(Math.random() * 50) + 1
    const b = Math.floor(Math.random() * 50) + 1
    const ops = ["+", "-", "*"]
    const op = ops[Math.floor(Math.random() * ops.length)]
    let answer
    if (op === "+") answer = a + b
    else if (op === "-") answer = a - b
    else answer = a * b

    activeQuiz[from] = String(answer)
    reply(`🔢 *MATH CHALLENGE*\n\n${a} ${op} ${b} = ?\n\n_Reply with .answer <number>_`)
})

// ===== WOULD YOU RATHER =====
const wyr = [
    "Hamesha ke liye ameer lekin akela rehna ya gareeb lekin loved ones ke saath?",
    "Future dekh sakna ya past change kar sakna?",
    "Hamesha sach bolna parey ya kabhi kuch na bol sakna?",
    "Fast internet hamesha ya unlimited khana hamesha?",
    "Ek din ke liye invisible hona ya ek din ke liye fly kar sakna?",
]

cmd({
    pattern: "wyr",
    alias: ["wouldyourather"],
    react: "🤔",
    desc: "Would you rather question",
    category: "fun",
    use: ".wyr",
    filename: __filename
},
async (conn, mek, m, { reply }) => {
    const w = wyr[Math.floor(Math.random() * wyr.length)]
    reply(`🤔 *WOULD YOU RATHER*\n\n${w}`)
})

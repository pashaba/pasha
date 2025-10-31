// pvb_complete_bot.js - Complete Auto Send Stock Bot with Web Database Integration
const axios = require('axios');
const readline = require('readline');

// ===============================
// 🌐 MULTI DATABASE MANAGER
// ===============================
class PvbMultiDatabaseManager {
    constructor() {
        this.configs = new Map();
        this.cacheDuration = 120000; // 2 menit cache
        this.webBaseUrl = 'https://pvb-bot.page.gd'; // Ganti dengan domain Anda
    }

    async fetchDatabaseConfig(dbId) {
        try {
            const now = Date.now();
            const cached = this.configs.get(dbId);
            
            if (cached && (now - cached.lastFetch) < this.cacheDuration) {
                return cached.config;
            }

            console.log(`🔄 PVB: Fetching config for database ${dbId}...`);
            
            const response = await axios.get(`${this.webBaseUrl}/pvb_api_config.php?db_id=${dbId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                },
                timeout: 15000,
            });

            console.log(`🔍 PVB: Response status: ${response.status}`);
            
            if (response.status !== 200) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const config = response.data;

            if (typeof config === 'string' && config.includes('<html>')) {
                console.log('❌ PVB: Cloudflare protection detected, using fallback config');
                return this.getFallbackConfig(dbId);
            }
            
            if (config.error) {
                throw new Error(config.error);
            }

            if (!config.targets || !Array.isArray(config.targets)) {
                console.log(`⚠️ PVB: Invalid targets format, using fallback`);
                return this.getFallbackConfig(dbId);
            }

            this.configs.set(dbId, {
                config: config,
                lastFetch: now
            });
            
            console.log(`✅ PVB: Config loaded for database ${dbId}: ${config.targets.length} targets`);
            return config;
            
        } catch (error) {
            console.log(`❌ PVB: Failed to fetch config for database ${dbId}:`, error.message);
            console.log('🔄 PVB: Using fallback config');
            return this.getFallbackConfig(dbId);
        }
    }

    // ✅ FALLBACK CONFIG UNTUK DATABASE 3
    getFallbackConfig(dbId) {
        if (dbId === 3) {
            const fallbackConfig = {
                targets: [
                    ["120363401455900532@newsletter", "7"],
                    ["120363421526426474@g.us", "1"],
                    ["120363419506559832@g.us", "2"],
                    ["120363401980058269@newsletter", "2"],
                    ["120363402158802389@newsletter", "3"],
                    ["120363421877327956@newsletter", "6"],
                    ["120363314602849511@newsletter", "5"],
                    ["120363420287965952@g.us", "1"],
                    ["120363328036612718@newsletter", "5"],
                    ["120363421612899599@newsletter", "3"],
                    ["120363404467300167@newsletter", "8"],
                    ["120363421266973679@newsletter", "5"],
                    ["120363421965460756@newsletter", "4"],
                    ["120363423064489475@newsletter", "10"],
                    ["120363405258997253@newsletter", "9"],
                    ["120363422478987789@newsletter", "5"],
                    ["120363312504642984@newsletter", "10"],
                    ["120363404142814464@newsletter", "13"],
                    ["120363404845803791@newsletter", "11"],
                    ["120363223627078743@newsletter", "16"],
                    ["120363422739927637@newsletter", "14"],
                    ["120363405724068650@newsletter", "14"],
                    ["120363302070923005@newsletter", "12"],
                    ["120363302096489922@newsletter", "17"],
                    ["120363423020067538@newsletter", "3"],
                    ["120363299395615260@newsletter", "10"]     
                ],
                settings: { active: true }
            };
            
            this.configs.set(dbId, {
                config: fallbackConfig,
                lastFetch: Date.now()
            });
            
            console.log(`✅ PVB: Using fallback config for database ${dbId}: ${fallbackConfig.targets.length} targets`);
            return fallbackConfig;
        }
        return null;
    }

    async getActiveDatabaseIds() {
        try {
            const response = await axios.get(`${this.webBaseUrl}/pvb_active_dbs.php`, {
                timeout: 10000
            });
            
            const data = response.data;
            
            if (data.success && data.databases) {
                const filteredDatabases = data.databases.filter(id => id === 3);
                console.log(`🎯 PVB: Filtered databases - only ID 3: ${filteredDatabases}`);
                return filteredDatabases;
            } else {
                throw new Error(data.error || 'Invalid response');
            }
        } catch (error) {
            console.log('⚠️ PVB: Using fallback database ID (only 3)');
            return [3];
        }
    }

    clearCache(dbId) {
        this.configs.delete(dbId);
        console.log(`🔄 PVB: Cache cleared for database ${dbId}`);
    }

    clearAllCache() {
        this.configs.clear();
        console.log('🔄 PVB: All caches cleared');
    }
}

// ===============================
// 🌐 FETCH LIVE STOCK FUNCTION
// ===============================
async function fetchLiveStock() {
    try {
        console.log("[🌐] Mengambil data Plants vs Brainrot...");

        const res = await axios.get(
            "https://jnoqohqfibboupyrzotb.supabase.co/rest/v1/stock_data?select=*&order=created_at.desc&limit=1",
            {
                headers: {
                    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impub3FvaHFmaWJib3VweXJ6b3RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NzcwMDksImV4cCI6MjA3NzA1MzAwOX0.qFb-w208e-mY9kood1fCLCAx2LiUAGJAFRA5-x17M94",
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impub3FvaHFmaWJib3VweXJ6b3RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NzcwMDksImV4cCI6MjA3NzA1MzAwOX0.qFb-w208e-mY9kood1fCLCAx2LiUAGJAFRA5-x17M94",
                    "Content-Type": "application/json"
                },
                timeout: 10000,
            }
        );

        console.log("[✅] Response dari Supabase:", res.status, res.statusText);

        let data = res.data;

        if (!data || !Array.isArray(data) || data.length === 0) {
            console.error("[⚠️] Tidak ada data di Supabase atau table kosong");
            return null;
        }

        const latestData = data[0];
        console.log("[📊] Data terbaru ID:", latestData.id);

        if (!latestData.seeds || !latestData.gear) {
            console.error("[⚠️] Data tidak valid:", latestData);
            return null;
        }

        let lines = [
            "🌻 *Seeds Stock*"
        ];

        for (const s of latestData.seeds) {
            const qtyText = s.qty > 0 ? `x${s.qty}` : "x0";
            lines.push(`• ${s.emoji} ${s.name} - ${qtyText}`);
        }

        lines.push("", "⚙️ *Gear Stock*");
        for (const g of latestData.gear) {
            const qtyText = g.qty > 0 ? `x${g.qty}` : "x0";
            lines.push(`• ${g.emoji} ${g.name} - ${qtyText}`);
        }

        console.log("[✅] Data berhasil diformat dan siap dikirim!");
        return lines.join("\n");

    } catch (err) {
        console.error("[❌] fetchLiveStock() error:", err.message);
        if (err.response) {
            console.error("[❌] Response error:", err.response.status, err.response.data);
        }
        return null;
    }
}

// ===============================
// 🧩 UTILITAS
// ===============================
function containsWord(text, word) {
    const regex = new RegExp("\\b" + word + "\\b", "i");
    return regex.test(text);
}

function capitalize(str) {
    return str.replace(/\b\w/g, c => c.toUpperCase());
}

// 🌿 TEMPLATE-TEMPLATE FORWARDER
// =============================== //
function getForwardedMessage1(text) {
    const lower = text.toLowerCase();
    const seeds = [
        {name: "cocotank", emoji: "🥥"},
        {name: "carnivorous plant", emoji: "🥩"},
        {name: "mr carrot", emoji: "🥕"},
        {name: "tomatrio", emoji: "🍅"},
        {name: "shroombino", emoji: "🍄"},
        {name: "mango", emoji: "🥭"},
        {name: "king limone", emoji: "🍋"}
    ];
    let hasStock = seeds.some((s) => containsWord(lower, s.name));
    if (!hasStock) return null;

    return [
        "*🌱 Seed Shop Restock!*",
        "",
        ...seeds.map((s) => `- ${s.emoji} ${s.name} ${containsWord(lower, s.name) ? "— 1x" : "— no stock"}`),
        "",
        "Note: `Kalau ga ada notif berarti stock nya jelek`",
    ].join("\n");
}

function getForwardedMessage2(text) {
    const lower = text.toLowerCase();
    const seeds = [
        {name: "cocotank", emoji: "🥥"},
        {name: "carnivorous plant", emoji: "🥩"},
        {name: "mr carrot", emoji: "🥕"},
        {name: "tomatrio", emoji: "🍅"},
        {name: "shroombino", emoji: "🍄"},
        {name: "mango", emoji: "🥭"},
        {name: "king limone", emoji: "🍋"}
    ];
    const available = seeds.filter((s) => containsWord(lower, s.name));
    const notAvailable = seeds.filter((s) => !containsWord(lower, s.name));
    if (available.length === 0) return null;

    const waktu = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
    return [
        "🔔 Ding ding! *Rare Stock Baru Tersedia! Jangan Sampai kelewatan Ya~ 🌱*",
        "━━━━━━━━━━━━━━━",
        "",
        "╔═《 🌿 Seed Shop Restock 》═╗",
        `📅 Update: ${waktu}`,
        "",
        "✅️ *Stok Tersedia:*",
        ...available.map((v) => `> ${v.emoji} ${v.name}`),
        "",
        notAvailable.length ? "❌ *Stok Tidak Tersedia:*" : "",
        ...notAvailable.map((v) => `- ${v.emoji} ${v.name}`),
        "",
        "━━━━━━━━━━━━━━━",
        "💡 *Catatan: Jika tidak ada notif, berarti stoknya kurang bagus*.",
        "Powered By : `https://www.panelcloud.xyz/`",
    ].join("\n");
}

function getForwardedMessage3(text) {
    const lower = text.toLowerCase();

    const seeds = [
        { name: "cocotank", emoji: "🥥", rarity: "Godly" },
        { name: "carnivorous plant", emoji: "🌺", rarity: "Godly" },
        { name: "mr carrot", emoji: "🥕🫅", rarity: "Secret" },
        { name: "tomatrio", emoji: "🍅", rarity: "Secret" },
        { name: "shroombino", emoji: "🍄", rarity: "Secret" },
        { name: "mango", emoji: "🥭", rarity: "Secret" },
        { name: "king limone", emoji: "🍋", rarity: "Secret" },
        { name: "beanstalk", emoji: "🫛", rarity: "??" }
    ];

    const stock = seeds.filter(s => containsWord(lower, s.name));
    if (stock.length === 0) return null;

    const lines = [
        "*_Plant Vs Brainrot Good Stock☘️☠️_*",
        "",
        "Ping :",
        "@" + stock.map(s => s.name.replace(/\s+/g, "_")).join(" @"),
        "",
        ...seeds.map(s => {
            const hasStock = containsWord(lower, s.name);
            const stockText = hasStock ? "x1" : "x0";
            return `${capitalize(s.name)} Seed ${s.emoji} ( ${s.rarity} ) - ${stockText}`;
        }),
        "",
        "*_𝐍𝐎𝐓𝐄 : 𝐀𝐃𝐀 𝐍𝐎𝐓𝐈𝐅 𝐀𝐃𝐀 𝐒𝐓𝐎𝐂𝐊 𝐁𝐀𝐆𝐔𝐒_*",
        "> bot"
    ];

    return lines.join("\n");
}

function getForwardedMessage4(text) {
    const lower = text.toLowerCase();
    const seeds = [
        {name: "cocotank", emoji: "🥥"},
        {name: "carnivorous plant", emoji: "🥩"},
        {name: "mr carrot", emoji: "🥕"},
        {name: "tomatrio", emoji: "🍅"},
        {name: "shroombino", emoji: "🍄"},
        {name: "mango", emoji: "🥭"},
        {name: "king limone", emoji: "🍋"}
    ];
    let hasStock = seeds.some((s) => containsWord(lower, s.name));
    if (!hasStock) return null;

    return ["*☘️ Seed Rare Restock! ☘️*", "", ...seeds.map((s) => `* ${s.emoji} ${s.name} — ${containsWord(lower, s.name) ? "1x" : "no stock"}`)].join("\n");
}

function getForwardedMessage5(text) {
    return text || null;
}

function getForwardedMessage6(text) {
    const lower = text.toLowerCase();
    const seeds = [
        {name: "carnivorous plant", emoji: "🥩"},
        {name: "mr carrot", emoji: "🥕"},
        {name: "tomatrio", emoji: "🍅"},
        {name: "shroombino", emoji: "🍄"},
        {name: "mango", emoji: "🥭"},
        {name: "king limone", emoji: "🍋"}
    ];
    let hasStock = seeds.some((s) => containsWord(lower, s.name));
    if (!hasStock) return null;

    return [
        "*🌱 Seed Shop Restock!*",
        "",
        ...seeds.map((s) => `• ${s.emoji} ${s.name} — ${containsWord(lower, s.name) ? "1x" : "no stock"}`),
        "",
        "Note : `Kalau ga ada notif berarti stock nya jelek`",
    ].join("\n");
}
    
async function getForwardedMessage7(zassbtz, jid, text) {
    const lower = text.toLowerCase();
    const seeds = [
        {name: "carnivorous plant", emoji: "🥩"},
        {name: "mr carrot", emoji: "🥕"},
        {name: "tomatrio", emoji: "🍅"},
        {name: "shroombino", emoji: "🍄"},
        {name: "mango", emoji: "🥭"},
        {name: "king limone", emoji: "🍋"}
    ];
    const available = seeds.filter((s) => containsWord(lower, s.name));
    if (available.length === 0) return;

    const waktu = new Date().toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
    });

    const messageText = [
        "🔔 *RARE STOCK UPDATE!* 🌿",
        "━━━━━━━━━━━━━━━━━━",
        "",
        ...seeds.map(
            (s) =>
                `• ${s.emoji} ${s.display || s.name} — ${
                    containsWord(lower, s.name) ? "1x" : "no stock"
                }`
        ),
        "",
        "━━━━━━━━━━━━━━━━━━",
        "> _♻️ Stok diperbarui otomatis setiap restock._",
        `> 🕒 ${waktu}`,
        "",
        "👑 *Powered by:* `https://www.panelcloud.xyz/`",
    ].join("\n");
    
    const buttons = [
        { buttonId: "w_stock", buttonText: { displayText: "🤩W Stock" }, type: 1 },
        { buttonId: "l_stock", buttonText: { displayText: "🤮L Stock" }, type: 1 },
    ];

    await zassbtz.sendMessage(jid, { text: messageText, buttons, headerType: 1 });
}

function getForwardedMessage8(text) {
    const lower = text.toLowerCase();
    const seeds = [
        { name: "cocotank", emoji: "🥥" },
        { name: "carnivorous plant", emoji: "🥩" },
        { name: "mr carrot", emoji: "🥕" },
        { name: "tomatrio", emoji: "🍅" },
        { name: "shroombino", emoji: "🍄" },
        { name: "mango", emoji: "🥭" },
        { name: "king limone", emoji: "🍋" },
    ];

    const available = seeds.filter(s => containsWord(lower, s.name));
    if (available.length === 0) return null;

    const tags = available.map(s => "@" + s.name.replace(/\s+/g, "").toLowerCase()).join(" ");

    const message = [
        `${tags}`,
        "",
        "*🌱 Seed Shop Restock!*",
        "",
        ...seeds.map(s => `- ${s.emoji} ${s.name} ${containsWord(lower, s.name) ? "— 1x" : "— no stock"}`),
        "",
        "Note: `Jika Tidak Ada Notif Maka Tidak Ada Stock Yang Bagus`",
        "",
        "shop kebutuhan pvb: https://storeid.websitee.web.id/pvb/store/",
        "copyright: https://storeid.websitee.web.id/pvb/",
    ].join("\n");

    return message;
}

function getForwardedMessage9(text) {
    const lower = text.toLowerCase();
    const seeds = [
        { name: "grape", emoji: "🍇" },
        { name: "cocotank", emoji: "🥥" },
        { name: "carnivorous plant", emoji: "🥩" },
        { name: "mr carrot", emoji: "🥕" },
        { name: "tomatrio", emoji: "🍅" },
        { name: "shroombino", emoji: "🍄" },
        { name: "mango", emoji: "🥭" },
        { name: "king limone", emoji: "🍋" },
    ];

    const available = seeds.filter(s => containsWord(lower, s.name));
    if (available.length === 0) return null;

    const tags = available.map(s => "@" + s.name.replace(/\s+/g, "").toLowerCase()).join(" ");

    const message = [
        `${tags}`,
        "",
        "*🌱 Seed Shop Restock!*",
        "",
        ...seeds.map(s => `- ${s.emoji} ${s.name} ${containsWord(lower, s.name) ? "— 1x" : "— no stock"}`),
        "",
        "`follow tiktok : @kinggasepp`",
        "Tembusin 5-10 reaction 👍 untuk prediksi / stock lainnya",
        "> Note: `kalau ngaada notif berarti stocknya jelek`",
    ].join("\n");

    return message;
}
    
function getForwardedMessage10(text) {
    const lower = text.toLowerCase();
    const seeds = [    
        { name: "cocotank", emoji: "🥥" },
        {name: "carnivorous plant", emoji: "🥩"},
        {name: "mr carrot", emoji: "🥕"},
        {name: "tomatrio", emoji: "🍅"},
        {name: "shroombino", emoji: "🍄"},
        {name: "mango", emoji: "🥭"},
        {name: "king limone", emoji: "🍋"}
    ];
    let hasStock = seeds.some((s) => containsWord(lower, s.name));
    if (!hasStock) return null;

    return [
        "*☘️Seed Shop Restock!🌱*",
        "",
        ...seeds.map((s) => `• ${s.emoji} ${s.name} — ${containsWord(lower, s.name) ? "1x" : "no stock"}`),
        "",
        "> KALAU GK POST BERARTI STOCK JELEK",
    ].join("\n");
}

function getForwardedMessage11(text) {
    if (!text) return null;

    const specialSeeds = [
        { name: "cocotank", emoji: "🥥"},
        { name: "carnivorous plant", emoji: "🥩" },
        { name: "mr carrot", emoji: "🥕" },
        { name: "tomatrio", emoji: "🍅" },
        { name: "shroombino", emoji: "🍄" },
        { name: "mango", emoji: "🥭" },
        { name: "king limone", emoji: "🍋" }
    ];

    const foundSeeds = specialSeeds.filter(seed =>
        text.toLowerCase().includes(seed.name)
    );

    if (foundSeeds.length === 0) return null;

    const emojiTitle = foundSeeds[0].emoji || "🍄";

    const list = foundSeeds
        .map(s => `- *_${s.emoji} ${capitalize(s.name)}_*\n ⤷ *Stock : +1*`)
        .join("\n═══════════════════════\n");

    return `*${emojiTitle} SEED RESTOCK ${emojiTitle}*
═══════════════════════
${list}
═══════════════════════

_🗒️Note:_ \`Aktifkan Notifikasi Agar Tidak Ketinggalan Info\``;
}

function getForwardedMessage12(text) {
    if (!text) return null;

    const seedLines = text
        .split("\n")
        .map(l => l.trim())
        .filter(l => l.startsWith("•"))
        .filter(l => /x\d+/i.test(l));

    if (seedLines.length === 0) return null;

    const list = seedLines
        .map(line => {
            const match = line.match(/•\s*(\S+)\s+(.+?)\s*-\s*x(\d+)/i);
            if (!match) return null;

            const [, emoji, name, qty] = match;
            if (parseInt(qty) <= 0) return null;

            return `- *_${emoji} ${capitalize(name)}_*\n ⤷ *Stock : +${qty}*`;
        })
        .filter(Boolean)
        .join("\n");

    if (!list) return null;

    return [
        "*🍄SEED RESTOCK🍄*",
        "═══════════════════════",
        list,
        "═══════════════════════",
        "",
        "_🗒️Note:_ `Aktifkan Notifikasi Agar Tidak Ketinggalan Info`"
    ].join("\n");
}

function getForwardedMessage13(text) {
    const lower = text.toLowerCase();
    const seeds = [
        {name: "cocotank", emoji: "🥥"},
        {name: "carnivorous plant", emoji: "🥩"},
        {name: "mr carrot", emoji: "🥕"},
        {name: "tomatrio", emoji: "🍅"},
        {name: "shroombino", emoji: "🍄"},
        {name: "mango", emoji: "🥭"},
        {name: "king limone", emoji: "🍋"}
    ];
    let hasStock = seeds.some((s) => containsWord(lower, s.name));
    if (!hasStock) return null;

    return [
        "*Seed Rare Restock🏆🌱*",
        "",
        ...seeds.map((s) => `- ${s.emoji} ${s.name} ${containsWord(lower, s.name) ? "— 1x" : "— no stock"}`),
        "",
        "Note: `Kalau ga ada notif berarti stock nya jelek`",
    ].join("\n");
}

function getForwardedMessage14(text) {
    if (!text) return null;

    const specialSeeds = [
        { name: "cocotank", emoji: "🥥" },
        { name: "carnivorous plant", emoji: "🥩" },
        { name: "mr carrot", emoji: "🥕" },
        { name: "tomatrio", emoji: "🍅" },
        { name: "shroombino", emoji: "🍄" },
        { name: "mango", emoji: "🥭" },
        { name: "king limone", emoji: "🍋" }
    ];

    const foundSeeds = specialSeeds.filter(seed =>
        text.toLowerCase().includes(seed.name)
    );

    if (foundSeeds.length === 0) return null;

    const emojiTitle = foundSeeds[0].emoji || "🍄";

    const list = foundSeeds
        .map(s => `- *_${s.emoji} ${capitalize(s.name)}_*\n ⤷ *Stock : +1*`)
        .join("\n═══════════════════════\n");

    return `*${emojiTitle} SEED RESTOCK ${emojiTitle}*
═══════════════════════
${list}
═══════════════════════

_🗒️Note:_ \`Aktifkan Notifikasi Agar Tidak Ketinggalan Info\``;
}

function getForwardedMessage15(text) {
    if (!text) return null;

    const specialSeeds = [
        { name: "cocotank", emoji: "🥥" },
        { name: "carnivorous plant", emoji: "🥩" },
        { name: "mr carrot", emoji: "🥕" },
        { name: "tomatrio", emoji: "🍅" },
        { name: "shroombino", emoji: "🍄" },
        { name: "mango", emoji: "🥭" },
        { name: "king limone", emoji: "🍋" }
    ];

    const foundSeeds = specialSeeds.filter(seed =>
        text.toLowerCase().includes(seed.name)
    );

    if (foundSeeds.length === 0) return null;

    const emojiTitle = foundSeeds[0].emoji || "🍄";

    const list = foundSeeds
        .map(s => `- *_${s.emoji} ${capitalize(s.name)}_*\n ⤷ *Stock : +1*`)
        .join("\n═══════════════════════\n");

    return `*${emojiTitle} SEED RESTOCK ${emojiTitle}*
═══════════════════════
${list}
═══════════════════════

_🗒️Note:_ \`sher saluran untuk mengaktifkan bot\``;
}

function getForwardedMessage16(text) {
    if (!text) return null;

    return [
        "Plants vs Brainrots Stock Update",
        text.trim(),
        "> saluran stock rare di bio yah"
    ].join("\n");
}

function getForwardedMessage17(text) {
    if (!text) return null;

    return [
        "Plants vs Brainrots Stock Update",
        text.trim()
    ].join("\n");
}  

// ===============================
// 📋 TEMPLATE REGISTRY & DYNAMIC MANAGER
// ===============================
const templateRegistry = {
    1: getForwardedMessage1,
    2: getForwardedMessage2,
    3: getForwardedMessage3,
    4: getForwardedMessage4,
    5: getForwardedMessage5,
    6: getForwardedMessage6,
    7: getForwardedMessage7,
    8: getForwardedMessage8,
    9: getForwardedMessage9,
    10: getForwardedMessage10,
    11: getForwardedMessage11,
    12: getForwardedMessage12,
    13: getForwardedMessage13,
    14: getForwardedMessage14,
    15: getForwardedMessage15,
    16: getForwardedMessage16,
    17: getForwardedMessage17
};

// ===============================
// 🎯 DYNAMIC TEMPLATE MANAGER
// ===============================
class DynamicTemplateManager {
    constructor() {
        this.nextTemplateId = 18; // Mulai dari ID setelah yang terakhir
    }

    // Tambah template baru dari kode fungsi
    addTemplateFromCode(functionCode) {
        try {
            // Ekstrak nama fungsi dan kode
            const functionMatch = functionCode.match(/function\s+(\w+)/);
            if (!functionMatch) {
                throw new Error('Format fungsi tidak valid');
            }

            const functionName = functionMatch[1];
            const templateId = this.nextTemplateId++;

            // Buat fungsi baru dari string kode
            const newFunction = eval(`(${functionCode})`);
            
            // Tambah ke registry
            templateRegistry[templateId] = newFunction;
            
            console.log(`✅ Template ${templateId} berhasil ditambahkan: ${functionName}`);
            return templateId;
            
        } catch (error) {
            console.log(`❌ Gagal menambah template:`, error.message);
            return null;
        }
    }

    // List semua template yang tersedia
    listTemplates() {
        console.log('\n📋 DAFTAR TEMPLATE YANG TERSEDIA:');
        console.log('================================');
        Object.keys(templateRegistry).forEach(id => {
            const func = templateRegistry[id];
            console.log(`📝 Template ${id}: ${func.name}`);
        });
        console.log('================================\n');
    }

    // Test template dengan data stock
    async testTemplate(templateId) {
        try {
            const templateFunc = templateRegistry[templateId];
            if (!templateFunc) {
                console.log(`❌ Template ${templateId} tidak ditemukan`);
                return;
            }

            console.log(`🧪 Testing template ${templateId}...`);
            const stockData = await fetchLiveStock();
            if (!stockData) {
                console.log('❌ Tidak bisa mendapatkan data stock');
                return;
            }

            const result = templateFunc(stockData);
            if (result) {
                console.log(`✅ Hasil template ${templateId}:`);
                console.log('--------------------------------');
                console.log(result);
                console.log('--------------------------------');
            } else {
                console.log(`ℹ️ Template ${templateId} mengembalikan null (tidak ada stock bagus)`);
            }
        } catch (error) {
            console.log(`❌ Error testing template:`, error.message);
        }
    }
}

// ===============================
// 🎯 TARGET MANAGER
// ===============================
class TargetManager {
    constructor(databaseManager) {
        this.dbManager = databaseManager;
        this.dbId = 3; // Default database ID
    }

    // Tambah target baru
    async addTarget(jid, templateId) {
        try {
            // Validasi input
            if (!jid || !templateId) {
                throw new Error('Format: add <jid> <templateId>');
            }

            // Validasi template exists
            if (!templateRegistry[templateId]) {
                throw new Error(`Template ${templateId} tidak ditemukan`);
            }

            // Get current config
            const config = await this.dbManager.fetchDatabaseConfig(this.dbId);
            if (!config) {
                throw new Error('Tidak bisa mendapatkan konfigurasi database');
            }

            // Cek apakah target sudah ada
            const existingTarget = config.targets.find(target => 
                target[0] === jid && target[1] === templateId
            );

            if (existingTarget) {
                console.log(`⚠️ Target sudah ada: ${jid} dengan template ${templateId}`);
                return;
            }

            // Tambah target baru
            config.targets.push([jid, templateId]);
            
            // Clear cache untuk memaksa reload
            this.dbManager.clearCache(this.dbId);
            
            console.log(`✅ Target berhasil ditambahkan:`);
            console.log(`   JID: ${jid}`);
            console.log(`   Template: ${templateId}`);
            console.log(`   Total targets: ${config.targets.length}`);

        } catch (error) {
            console.log(`❌ Gagal menambah target:`, error.message);
        }
    }

    // List semua target
    async listTargets() {
        try {
            const config = await this.dbManager.fetchDatabaseConfig(this.dbId);
            if (!config || !config.targets) {
                console.log('❌ Tidak ada targets');
                return;
            }

            console.log(`\n🎯 DAFTAR TARGET (Database ${this.dbId}):`);
            console.log('================================');
            config.targets.forEach((target, index) => {
                const [jid, templateId] = target;
                console.log(`${index + 1}. ${jid} -> Template ${templateId}`);
            });
            console.log(`Total: ${config.targets.length} targets`);
            console.log('================================\n');
        } catch (error) {
            console.log('❌ Gagal mendapatkan daftar target:', error.message);
        }
    }

    // Hapus target
    async removeTarget(index) {
        try {
            const config = await this.dbManager.fetchDatabaseConfig(this.dbId);
            if (!config || !config.targets) {
                throw new Error('Tidak ada targets');
            }

            if (index < 1 || index > config.targets.length) {
                throw new Error('Index tidak valid');
            }

            const removed = config.targets.splice(index - 1, 1)[0];
            this.dbManager.clearCache(this.dbId);
            
            console.log(`✅ Target berhasil dihapus: ${removed[0]} (Template ${removed[1]})`);
            console.log(`   Sisa targets: ${config.targets.length}`);
            
        } catch (error) {
            console.log('❌ Gagal menghapus target:', error.message);
        }
    }
}

// ===============================
// 🎮 CONSOLE COMMAND INTERFACE
// ===============================
class ConsoleCommandInterface {
    constructor(databaseManager, targetManager, templateManager) {
        this.dbManager = databaseManager;
        this.targetManager = targetManager;
        this.templateManager = templateManager;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'PVB-BOT> '
        });
    }

    start() {
        console.log('\n🎮 PVB BOT CONSOLE COMMAND INTERFACE');
        console.log('==================================');
        this.showHelp();
        this.rl.prompt();

        this.rl.on('line', async (line) => {
            const input = line.trim();
            if (!input) {
                this.rl.prompt();
                return;
            }

            await this.processCommand(input);
            this.rl.prompt();
        });

        this.rl.on('close', () => {
            console.log('\n👋 Console command interface ditutup');
            process.exit(0);
        });
    }

    async processCommand(input) {
        const args = input.split(' ');
        const command = args[0].toLowerCase();

        try {
            switch (command) {
                case 'help':
                    this.showHelp();
                    break;

                case 'add':
                    if (args.length < 3) {
                        console.log('❌ Format: add <jid> <templateId>');
                        console.log('   Contoh: add 120363423020067538@newsletter 1');
                        return;
                    }
                    await this.targetManager.addTarget(args[1], args[2]);
                    break;

                case 'list':
                    if (args[1] === 'targets') {
                        await this.targetManager.listTargets();
                    } else if (args[1] === 'templates') {
                        this.templateManager.listTemplates();
                    } else {
                        console.log('❌ Gunakan: list targets atau list templates');
                    }
                    break;

                case 'remove':
                    if (args.length < 2) {
                        console.log('❌ Format: remove <index>');
                        console.log('   Contoh: remove 1');
                        return;
                    }
                    await this.targetManager.removeTarget(parseInt(args[1]));
                    break;

                case 'test':
                    if (args.length < 2) {
                        console.log('❌ Format: test <templateId>');
                        console.log('   Contoh: test 1');
                        return;
                    }
                    await this.templateManager.testTemplate(args[1]);
                    break;

                case 'addtemplate':
                    // Untuk add template, kita perlu multi-line input
                    console.log('📝 Masukkan kode template (tekan Enter 2x untuk selesai):');
                    await this.multiLineTemplateInput();
                    break;

                case 'refresh':
                    this.dbManager.clearAllCache();
                    console.log('✅ Cache refreshed');
                    break;

                case 'stock':
                    const stock = await fetchLiveStock();
                    if (stock) {
                        console.log('📊 Current Stock:');
                        console.log(stock);
                    } else {
                        console.log('❌ Gagal mendapatkan stock');
                    }
                    break;

                case 'exit':
                case 'quit':
                    this.rl.close();
                    break;

                default:
                    console.log('❌ Command tidak dikenali. Ketik "help" untuk bantuan.');
            }
        } catch (error) {
            console.log('❌ Error:', error.message);
        }
    }

    async multiLineTemplateInput() {
        return new Promise((resolve) => {
            let templateCode = '';
            let lineCount = 0;

            const multiLineRL = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            multiLineRL.on('line', (line) => {
                if (line.trim() === '' && lineCount > 0) {
                    multiLineRL.close();
                    resolve(templateCode);
                    return;
                }
                
                templateCode += line + '\n';
                lineCount++;
            });

            multiLineRL.on('close', () => {
                // Process the template code
                if (templateCode.trim()) {
                    const templateId = this.templateManager.addTemplateFromCode(templateCode.trim());
                    if (templateId) {
                        console.log(`✅ Template berhasil ditambahkan dengan ID: ${templateId}`);
                    }
                }
                this.rl.prompt();
                resolve();
            });
        });
    }

    showHelp() {
        console.log(`
🎯 **AVAILABLE COMMANDS:**

📋 **Target Management:**
  add <jid> <templateId>    - Tambah target baru
  list targets              - Lihat daftar semua target
  remove <index>            - Hapus target berdasarkan index

📝 **Template Management:**
  list templates            - Lihat daftar template yang tersedia
  test <templateId>         - Test template dengan data stock aktual
  addtemplate               - Tambah template baru (multi-line input)

🔧 **Utility:**
  stock                     - Lihat stock saat ini
  refresh                   - Refresh cache database
  help                      - Tampilkan bantuan ini
  exit / quit               - Keluar dari console

📚 **Examples:**
  add 120363423020067538@newsletter 1
  list targets
  test 14
  remove 1
        `);
    }
}

// ===============================
// 🚀 AUTO SEND STOCK SYSTEM
// ===============================
async function autoSendStock(zassbtz) {
    const dbManager = new PvbMultiDatabaseManager();
    let lastSentMinute = null;
    let sendStats = {};

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    const sendMessagesForDatabase = async (dbId) => {
        console.log(`\n📦 Processing Database ${dbId}...`);
        
        const config = await dbManager.fetchDatabaseConfig(dbId);
        if (!config) {
            console.log(`❌ Skip database ${dbId} - no config`);
            return;
        }

        if (!config.targets || !Array.isArray(config.targets)) {
            console.log(`❌ Skip database ${dbId} - invalid targets format`);
            return;
        }

        if (config.targets.length === 0) {
            console.log(`⏸️ Skip database ${dbId} - no targets`);
            return;
        }

        if (config.settings?.active === false) {
            console.log(`⏸️ Database ${dbId} is inactive`);
            return;
        }

        const text = await fetchLiveStock();
        if (!text) {
            console.log(`⚠️ No stock data for database ${dbId}`);
            return;
        }

        const messages = {};
        for (const [templateId, templateFunc] of Object.entries(templateRegistry)) {
            if (templateId === '7') continue;
            
            try {
                messages[templateId] = templateFunc(text);
            } catch (error) {
                console.log(`❌ Error in template ${templateId}:`, error);
                messages[templateId] = null;
            }
        }

        let successCount = 0;
        let failCount = 0;

        console.log(`📤 Sending to ${config.targets.length} targets for database ${dbId}...`);

        for (let i = 0; i < config.targets.length; i++) {
            const target = config.targets[i];
            
            if (!Array.isArray(target) || target.length < 2) {
                console.log(`⚠️ Skip invalid target format:`, target);
                continue;
            }

            const [jid, templateId] = target;
            
            if (!templateId || templateId === 'null' || !jid) {
                console.log(`⚠️ Skip target - missing jid or templateId:`, target);
                continue;
            }

            let success = false;

            for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                    if (templateId === '7') {
                        await getForwardedMessage7(zassbtz, jid, text);
                    } else {
                        const message = messages[templateId];
                        if (!message) {
                            console.log(`⚠️ Skip ${jid} - no message from template ${templateId}`);
                            break;
                        }
                        await zassbtz.sendMessage(jid, { text: message });
                    }
                    
                    console.log(`✅ (${attempt}x) Database ${dbId} - Sent to ${jid} (Template ${templateId})`);
                    success = true;
                    successCount++;
                    break;
                } catch (e) {
                    console.log(`❌ (${attempt}x) Database ${dbId} - Failed to ${jid}:`, e.message);
                    if (attempt === 3) failCount++;
                    await delay(800);
                }
            }
            await delay(500);
        }

        sendStats[dbId] = {
            success: successCount,
            failed: failCount,
            total: config.targets.length,
            lastSend: new Date().toLocaleString('id-ID')
        };

        console.log(`🎯 Database ${dbId} completed: ${successCount} success, ${failCount} failed`);
    };

    const sendAllMessages = async () => {
        console.log('\n🚀 ===== STARTING MULTI-DATABASE SEND =====');
        
        const dbIds = await dbManager.getActiveDatabaseIds();
        console.log(`📊 Processing ${dbIds.length} databases:`, dbIds);

        for (const dbId of dbIds) {
            await sendMessagesForDatabase(dbId);
            await delay(2000);
        }

        console.log('\n📈 ===== SEND STATISTICS =====');
        for (const [dbId, stats] of Object.entries(sendStats)) {
            console.log(`Database ${dbId}: ${stats.success}/${stats.total} success - ${stats.lastSend}`);
        }
        console.log('🎯 All databases processed. Waiting for next schedule...\n');
    };

    const checkAndSend = async () => {
        const now = new Date();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        if (minutes % 5 === 0 && seconds === 30) {
            if (lastSentMinute !== minutes) {
                lastSentMinute = minutes;
                await sendAllMessages();
            }
        }
        setTimeout(checkAndSend, 1000);
    };

    checkAndSend();
    return dbManager;
}

// ===============================
// 🎯 START BOT FUNCTION
// ===============================
let databaseManager;
let commandInterface;

async function startPVBBot(zassbtz) {
    console.log('🤖 Starting PVB Multi-Database Bot...');
    databaseManager = await autoSendStock(zassbtz);
    
    // Initialize managers
    const targetManager = new TargetManager(databaseManager);
    const templateManager = new DynamicTemplateManager();
    commandInterface = new ConsoleCommandInterface(databaseManager, targetManager, templateManager);
    
    // Start command interface
    commandInterface.start();
    
    console.log('✅ PVB Bot started successfully with Console Commands!');
    
    // Auto refresh cache setiap 30 menit
    setInterval(() => {
        if (databaseManager) {
            databaseManager.clearAllCache();
            console.log('🔄 Auto-refreshed all caches');
        }
    }, 30 * 60 * 1000);

    return {
        databaseManager,
        targetManager,
        templateManager,
        commandInterface
    };
}

// Manual control functions
function refreshDatabaseCache(dbId = null) {
    if (dbId && databaseManager) {
        databaseManager.clearCache(dbId);
        console.log(`🔄 Cache cleared for database ${dbId}`);
    } else if (databaseManager) {
        databaseManager.clearAllCache();
        console.log('🔄 All caches cleared');
    }
}

function getSendStats() {
    return sendStats;
}

// Export untuk digunakan di file lain
module.exports = {
    startPVBBot,
    refreshDatabaseCache,
    getSendStats,
    fetchLiveStock,
    templateRegistry,
    DynamicTemplateManager,
    TargetManager
};

// Jika file ini di-run langsung
if (require.main === module) {
    console.log('PVB Bot System Loaded - Ready to integrate with your main bot file');
    console.log('Usage: const { startPVBBot } = require("./pvb_complete_bot");');
    console.log('Then call: startPVBBot(zassbtz); when your bot is connected');
}

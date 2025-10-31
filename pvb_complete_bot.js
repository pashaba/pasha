// pvb_complete_bot.js - Complete Auto Send Stock Bot with Web Database Integration
const axios = require('axios');
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
        
        // ✅ GUNAKAN HEADERS LENGKAP SEPERTI fetchLiveStock
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

        // 🔥 CEK JIKA RESPONSE ADALAH HTML (Cloudflare protection)
        if (typeof config === 'string' && config.includes('<html>')) {
            console.log('❌ PVB: Cloudflare protection detected, using fallback config');
            return this.getFallbackConfig(dbId);
        }
        
        if (config.error) {
            throw new Error(config.error);
        }

        // Validasi targets
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
                ["120363423020067538@newsletter", "3"]
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
            // ✅ GUNAKAN AXIOS, BUKAN FETCH
            const response = await axios.get(`${this.webBaseUrl}/pvb_active_dbs.php`, {
                timeout: 10000
            });
            
            const data = response.data; // ✅ data langsung dari axios
            
            if (data.success && data.databases) {
                // 🔥 FILTER: Hanya ambil database ID 3
                const filteredDatabases = data.databases.filter(id => id === 3);
                console.log(`🎯 PVB: Filtered databases - only ID 3: ${filteredDatabases}`);
                return filteredDatabases;
            } else {
                throw new Error(data.error || 'Invalid response');
            }
        } catch (error) {
            console.log('⚠️ PVB: Using fallback database ID (only 3)');
            return [3]; // 🔥 Fallback HANYA ID 3
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

    // --- Validasi response dari Supabase ---
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error("[⚠️] Tidak ada data di Supabase atau table kosong");
      return null;
    }

    // Ambil data terbaru (index 0)
    const latestData = data[0];
    console.log("[📊] Data terbaru ID:", latestData.id);

    // --- Validasi isi ---
    if (!latestData.seeds || !latestData.gear) {
      console.error("[⚠️] Data tidak valid:", latestData);
      return null;
    }

    // --- Format jadi teks untuk template ---
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

  // Deteksi yang ada stok
  const stock = seeds.filter(s => containsWord(lower, s.name));

  // Kalau tidak ada yang stok, hentikan
  if (stock.length === 0) return null;

  // Format isi
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

  // Helper untuk kapital huruf awal tiap kata
  function capitalize(str) {
    return str.replace(/\b\w/g, c => c.toUpperCase());
  }
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

  // Cek seed mana yang ada stock
  const available = seeds.filter(s => containsWord(lower, s.name));

  if (available.length === 0) return null;

  // Buat tag otomatis misalnya @mrCarrot
  const tags = available.map(s => "@" + s.name.replace(/\s+/g, "").toLowerCase()).join(" ");

  // Format pesan utama
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

  // Cek seed mana yang ada stock
  const available = seeds.filter(s => containsWord(lower, s.name));

  if (available.length === 0) return null;

  // Buat tag otomatis misalnya @mrCarrot
  const tags = available.map(s => "@" + s.name.replace(/\s+/g, "").toLowerCase()).join(" ");

  // Format pesan utama
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

  // cek seed spesial di teks
  const foundSeeds = specialSeeds.filter(seed =>
    text.toLowerCase().includes(seed.name)
  );

  // kalau tidak ada special seed → tidak kirim apa pun
  if (foundSeeds.length === 0) return null;

  // emoji judul dari seed pertama
  const emojiTitle = foundSeeds[0].emoji || "🍄";

  // format daftar restock
  const list = foundSeeds
    .map(s => `- *_${s.emoji} ${capitalize(s.name)}_*\n ⤷ *Stock : +1*`)
    .join("\n═══════════════════════\n");

  // hasil akhir
  return `*${emojiTitle} SEED RESTOCK ${emojiTitle}*
═══════════════════════
${list}
═══════════════════════

_🗒️Note:_ \`Aktifkan Notifikasi Agar Tidak Ketinggalan Info\``;
}

// fungsi bantu kapitalisasi huruf awal tiap kata
function capitalize(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

// Kapitalisasi huruf depan setiap kata
function capitalize(str) {
  return str
    .split(" ")
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}
     function getForwardedMessage12(text) {
  if (!text) return null;

  // Ambil semua baris dari hasil endpoint yang berisi emoji + nama + jumlah (contoh: • 🍄 Shroombino - x1)
  const seedLines = text
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.startsWith("•"))
    .filter(l => /x\d+/i.test(l)); // hanya baris yang punya jumlah stok

  if (seedLines.length === 0) return null;

  // Ubah jadi format restock (mirip template 13)
  const list = seedLines
    .map(line => {
      const match = line.match(/•\s*(\S+)\s+(.+?)\s*-\s*x(\d+)/i);
      if (!match) return null;

      const [, emoji, name, qty] = match;
      if (parseInt(qty) <= 0) return null; // hanya tampilkan stok tersedia

      return `- *_${emoji} ${capitalize(name)}_*\n ⤷ *Stock : +${qty}*`;
    })
    .filter(Boolean)
    .join("\n");

  if (!list) return null;

  // Template akhir (tanpa tombol, mirip 13 tapi strukturnya seperti 14)
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

  // cek seed spesial di teks
  const foundSeeds = specialSeeds.filter(seed =>
    text.toLowerCase().includes(seed.name)
  );

  // kalau tidak ada special seed → tidak kirim apa pun
  if (foundSeeds.length === 0) return null;

  // emoji judul dari seed pertama
  const emojiTitle = foundSeeds[0].emoji || "🍄";

  // format daftar restock
  const list = foundSeeds
    .map(s => `- *_${s.emoji} ${capitalize(s.name)}_*\n ⤷ *Stock : +1*`)
    .join("\n═══════════════════════\n");

  // hasil akhir
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

  // cek seed spesial di teks
  const foundSeeds = specialSeeds.filter(seed =>
    text.toLowerCase().includes(seed.name)
  );

  // kalau tidak ada special seed → tidak kirim apa pun
  if (foundSeeds.length === 0) return null;

  // emoji judul dari seed pertama
  const emojiTitle = foundSeeds[0].emoji || "🍄";

  // format daftar restock
  const list = foundSeeds
    .map(s => `- *_${s.emoji} ${capitalize(s.name)}_*\n ⤷ *Stock : +1*`)
    .join("\n═══════════════════════\n");

  // hasil akhir
  return `*${emojiTitle} SEED RESTOCK ${emojiTitle}*
═══════════════════════
${list}
═══════════════════════

_🗒️Note:_ \`sher saluran untuk mengaktifkan bot\``;
}
// fungsi bantu kapitalisasi huruf awal tiap kata
function capitalize(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
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
//
// ===============================
// 📋 TEMPLATE REGISTRY
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
// 🚀 AUTO SEND STOCK SYSTEM
// ===============================
async function autoSendStock(zassbtz) {
    const dbManager = new PvbMultiDatabaseManager();
    let lastSentMinute = null;
    let sendStats = {};

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const sendMessagesForDatabase = async (dbId) => {
    console.log(`\n📦 Processing Database ${dbId}...`);
    
    // Get config dari web untuk database ini
    const config = await dbManager.fetchDatabaseConfig(dbId);
    if (!config) {
        console.log(`❌ Skip database ${dbId} - no config`);
        return;
    }

    // 🔥 PERBAIKAN: Validasi targets
    if (!config.targets || !Array.isArray(config.targets)) {
        console.log(`❌ Skip database ${dbId} - invalid targets format`);
        return;
    }

    if (config.targets.length === 0) {
        console.log(`⏸️ Skip database ${dbId} - no targets`);
        return;
    }

    // Check jika database aktif
    if (config.settings?.active === false) {
        console.log(`⏸️ Database ${dbId} is inactive`);
        return;
    }

    // Get stock data
    const text = await fetchLiveStock();
    if (!text) {
        console.log(`⚠️ No stock data for database ${dbId}`);
        return;
    }

    // Generate messages untuk semua template
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

    // Kirim ke semua target
    let successCount = 0;
    let failCount = 0;

    console.log(`📤 Sending to ${config.targets.length} targets for database ${dbId}...`);

    for (let i = 0; i < config.targets.length; i++) {
        const target = config.targets[i];
        
        // 🔥 PERBAIKAN: Validasi format target
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

    // Update statistics
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

        // Log statistics
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

        // Jadwal pengiriman tiap 5 menit di detik 30
        if (minutes % 5 === 0 && seconds === 30) {
            if (lastSentMinute !== minutes) {
                lastSentMinute = minutes;
                await sendAllMessages();
            }
        }
        setTimeout(checkAndSend, 1000);
    };

    // Start the scheduler
    checkAndSend();
    return dbManager;
}

// ===============================
// 🎯 START BOT FUNCTION
// ===============================
let databaseManager;

async function startPVBBot(zassbtz) {
    console.log('🤖 Starting PVB Multi-Database Bot...');
    databaseManager = await autoSendStock(zassbtz);
    console.log('✅ PVB Bot started successfully!');
    
    // Auto refresh cache setiap 30 menit
    setInterval(() => {
        if (databaseManager) {
            databaseManager.clearAllCache();
            console.log('🔄 Auto-refreshed all caches');
        }
    }, 30 * 60 * 1000);

    return databaseManager;
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
    templateRegistry
};

// Jika file ini di-run langsung
if (require.main === module) {
    console.log('PVB Bot System Loaded - Ready to integrate with your main bot file');
    console.log('Usage: const { startPVBBot } = require("./pvb_complete_bot");');
    console.log('Then call: startPVBBot(zassbtz); when your bot is connected');
}
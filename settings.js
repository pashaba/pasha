/*═══════════════════════════════════════════════════════
 *  ⌬  YT NeoShiroko Labs
 *═══════════════════════════════════════════════════════
 *  🌐  Website     : https://www.neolabsofficial.my.id
 *  ⌨︎  Developer   : https://zass.cloud
 *  ▶︎  YouTube     : https://www.youtube.com/@zassci_desu
 *  ⚙︎  Panel Murah : pteroku-desu.zass.cloud
 *
 *  ⚠︎  Mohon untuk tidak menghapus watermark ini
 *═══════════════════ © 2025 Zass Desuta ─════════════════════
 */
const fs = require('fs')
const chalk = require('chalk')

//——————————[ Config Owner ]——————————//
global.ownernumber = '639816558373' // Ganti nomer mu
global.ownername = 'pasha'

//——————————[ Config Bot ]——————————//
global.namabot = "Kuroko"
global.nomorbot = '639816558373' // Ganti no botmu
global.pair = "KUROKOKU"
global.version = '5.0.0'
global.autojoingc = false
global.anticall = false
global.autoreadsw = false
global.autoread = false

//——————————[ Config Sosmed ]——————————//
global.web = "https://www.neolabsofficial.my.id"
global.linkSaluran = "https://whatsapp.com/channel/0029Vb6w7eO9sBIEUYRgeC30"
global.idSaluran = "120363421570647022@newsletter"
global.nameSaluran = "Neo'S Labs Ch."

//——————————[ Config Wm ]——————————//
global.packname = 'Stick By Kuroko'
global.author = 'YT NeoShiroko Labs'
global.foother = 'Made By Zass Desuta'

//——————————[ Config Payment ]——————————//
//Note : Kalau gada isi aja jadi false
global.dana = "085298027445"
global.ovo = false
global.gopay = "085298027445"
global.qris = false
global.an = {
    dana: "nama_dana",
    ovo: "nama_ovo",
    gopay: "nama_gopay"
}

//——————————[ Config Media ]——————————//
global.img = "https://files.cloudkuimages.guru/images/aDTzWN7n.jpg"
global.thumbxm = "https://files.catbox.moe/q57r0k.jpg"
global.thumbbc = "https://files.catbox.moe/lrfpvb.jpg"
global.thumb = [ 
    "https://files.cloudkuimages.guru/images/f70e44a47814.jpg",
    "https://files.catbox.moe/49j4go.jpg",
    "https://files.cloudkuimages.guru/images/d7tfhlE6.jpg",
    "https://files.cloudkuimages.guru/images/B3MN20qF.jpg",
    "https://files.cloudkuimages.guru/images/eXlyb3iP.jpg",
    "https://files.cloudkuimages.guru/images/DhtN6slx.jpg",
    "https://files.cloudkuimages.guru/images/OIdJobRB.jpg",
    "https://files.cloudkuimages.guru/images/YnmobSc5.jpg"
]

//——————————[ Config Broadcast ]——————————//
// Delay Jpm & Pushctc || 1000 = 1detik
global.delayJpm = 3500
global.delayPushkontak = 5000
global.namakontak = "AutoSave Kuroko"

//——————————[ Config Message ]——————————//
global.mess = {
    success: 'sᴜᴄᴄᴇssғᴜʟʏ',
    admin: '[ !! ] *sʏsᴛᴇᴍ*\nᴋʜᴜsᴜs ᴀᴅᴍɪɴ ɢʀᴏᴜᴘ',
    botAdmin: '[ !! ] *sʏsᴛᴇᴍ*\nʙᴏᴛ ʙᴇʟᴜᴍ ᴊᴀᴅɪ ᴀᴅᴍɪɴ',
    creator: '[ !! ] *sʏsᴛᴇᴍ*\nғᴇᴀᴛᴜʀᴇ ɪɴɪ ᴋʜᴜsᴜs ᴏᴡɴᴇʀ',
    group: '[ !! ] *sʏsᴛᴇᴍ*\nғᴇᴀᴛᴜʀᴇ ɪɴɪ ᴋʜᴜsᴜs ɢʀᴏᴜᴘ ᴀᴊᴀ',
    private: '[ !! ] *sʏsᴛᴇᴍ*\nғᴇᴀᴛᴜʀᴇ ᴋʜᴜsᴜs ᴘʀɪᴠᴀᴛᴇ ᴄʜᴀᴛ',
    wait: '[ !! ] *sʏsᴛᴇᴍ*\nᴡᴀɪᴛ ᴘʀᴏsᴇs ᴅᴜʟᴜ',
}



// *** message *** 
global.closeMsgInterval = 30; // 30 menit. maksimal 60 menit, minimal 1 menit
global.backMsgInterval = 2; // 2 jam. maksimal 24 jam, minimal 1 jam

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})

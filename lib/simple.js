import path from 'path'
import { toAudio } from './converter.js'
import chalk from 'chalk'
import fetch from 'node-fetch'
import PhoneNumber from 'awesome-phonenumber'
import fs from 'fs'
import { fileTypeFromBuffer } from 'file-type'
import { fileURLToPath } from 'url'
import store from './store.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const baileys = await import('@whiskeysockets/baileys');
const {
    default: makeWASocket,
    makeWALegacySocket,
    proto,
    downloadContentFromMessage,
    jidDecode,
    areJidsSameUser,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    WAMessageStubType,
    extractMessageContent,
    prepareWAMessageMedia,
    WA_DEFAULT_EPHEMERAL,
} = baileys;

const MediaType = ["imageMessage", "videoMessage", "audioMessage", "stickerMessage", "documentMessage"];

export { makeWASocket as makeWASocket };

export function makeWASocket(connectionOptions, options = {}) {
    const conn = (global.opts["legacy"] ? makeWALegacySocket : makeWASocket)(connectionOptions);

    return Object.defineProperties(conn, {
        chats: { value: { ...(options.chats || {}) }, writable: true },
        decodeJid: { value(jid) { return (!jid || typeof jid !== "string") ? (!nullish(jid) && jid) || null : jid.decodeJid(); } },
        logger: {
            get() {
                const logColor = { info: [51, 204, 51], error: [247, 38, 33], warn: [255, 153, 0], debug: [66, 167, 245] };
                return Object.fromEntries(Object.keys(logColor).map(k => [k, (...args) => console.log(chalk.bold.bgRgb(...logColor[k])(k.toUpperCase()), `[${new Date().toUTCString()}]:`, chalk[k === 'error' ? 'rgb(255,38,0)' : k === 'warn' ? 'redBright' : k === 'debug' ? 'white' : 'cyan'](...args))]));
            }, enumerable: true
        },
        sendSylph: { async value(jid, text = '', buffer, title, body, url, quoted, options) { if (buffer) try { buffer = (await conn.getFile(buffer)).data } catch { }; const prep = generateWAMessageFromContent(jid, { extendedTextMessage: { text, contextInfo: { externalAdReply: { title, body, thumbnail: buffer, sourceUrl: url }, mentionedJid: await conn.parseMention(text) } } }, { quoted }); return conn.relayMessage(jid, prep.message, { messageId: prep.key.id }); } },
        getFile: {
            async value(PATH, saveToFile = false) {
                let res, filename;
                const data = Buffer.isBuffer(PATH) ? PATH : PATH instanceof ArrayBuffer ? PATH.toBuffer() : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], "base64") : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? ((filename = PATH), fs.readFileSync(PATH)) : Buffer.alloc(0);
                if (!Buffer.isBuffer(data)) throw new TypeError("Result is not a buffer");
                const type = (await fileTypeFromBuffer(data)) || { mime: "application/octet-stream", ext: ".bin" };
                if (data && saveToFile && !filename) await fs.promises.writeFile((filename = path.join(__dirname, "../tmp/" + Date.now() + "." + type.ext)), data);
                return { res, filename, ...type, data, deleteFile: () => filename && fs.promises.unlink(filename) };
            }, enumerable: true
        },
        sendFile: {
            async value(jid, path, filename = "", caption = "", quoted, ptt = false, options = {}) {
                const type = await conn.getFile(path, true);
                let { data: file, filename: pathFile } = type;
                const opt = quoted ? { quoted } : {};
                let mtype = /webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker) ? "sticker" : /image/.test(type.mime) ? "image" : /video/.test(type.mime) ? "video" : /audio/.test(type.mime) ? (file = (await toAudio(file, type.ext)).data, "audio") : "document";
                if (options.asDocument) mtype = "document";
                const message = { ...options, caption, ptt, [mtype]: { url: pathFile }, mimetype: options.mimetype || type.mime, fileName: filename || pathFile.split("/").pop() };
                try { return await conn.sendMessage(jid, message, { ...opt, ...options }); } catch { return await conn.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options }); }
            }, enumerable: true
        },
        reply: { value(jid, text = "", quoted, options) { return Buffer.isBuffer(text) ? conn.sendFile(jid, text, "file", "", quoted, false, options) : conn.sendMessage(jid, { ...options, text }, { quoted, ...options }); } },
        parseMention: {
            value(text = "") {
                const codes = ["1", "7", "20", "27", "30", "31", "32", "33", "34", "36", "39", "40", "41", "43", "44", "45", "46", "47", "48", "49", "51", "52", "53", "54", "55", "56", "57", "58", "60", "61", "62", "63", "64", "65", "66", "81", "82", "84", "86", "90", "91", "92", "93", "94", "95", "98", "211", "212", "213", "216", "218", "220", "221", "222", "223", "224", "225", "226", "227", "228", "229", "230", "231", "232", "233", "234", "235", "236", "237", "238", "239", "240", "241", "242", "243", "244", "245", "246", "248", "249", "250", "251", "252", "253", "254", "255", "256", "257", "258", "260", "261", "262", "263", "264", "265", "266", "267", "268", "269", "290", "291", "297", "298", "299", "350", "351", "352", "353", "354", "355", "356", "357", "358", "359", "370", "371", "372", "373", "374", "375", "376", "377", "378", "379", "380", "381", "382", "383", "385", "386", "387", "389", "420", "421", "423", "500", "501", "502", "503", "504", "505", "506", "507", "508", "509", "590", "591", "592", "593", "594", "595", "596", "597", "598", "599", "670", "672", "673", "674", "675", "676", "677", "678", "679", "680", "681", "682", "683", "685", "686", "687", "688", "689", "690", "691", "692", "850", "852", "853", "855", "856", "880", "886", "960", "961", "962", "963", "964", "965", "966", "967", "968", "970", "971", "972", "973", "974", "975", "976", "977", "978", "979", "992", "993", "994", "995", "996", "998"];
                const valid = n => n.length >= 8 && n.length <= 13 && !(n.length > 10 && n.startsWith("9")) && codes.some(c => n.startsWith(c));
                return (text.match(/@(\d{5,20})/g) || []).map(m => m.substring(1)).filter(valid).map(n => `${n}@s.whatsapp.net`);
            }, enumerable: true
        },
        getName: {
            value(jid = "", withoutContact = false) {
                if (!jid || typeof jid !== "string") return "";
                jid = conn.decodeJid(jid);
                if (jid.endsWith("@g.us")) return new Promise(async r => { try { const v = conn.chats[jid] || await conn?.groupMetadata(jid).catch(() => ({})); r(v.name || v.subject || PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber("international")); } catch { r(""); } });
                const v = jid === "0@s.whatsapp.net" ? { jid, vname: "WhatsApp" } : areJidsSameUser(jid, conn.user.id) ? conn.user : conn.chats[jid] || {};
                return (withoutContact ? "" : v.name) || v.subject || v.vname || v.notify || v.verifiedName || PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber("international");
            }
        },
        downloadM: { async value(m, type, saveToFile) { if (!m?.url && !m?.directPath) return Buffer.alloc(0); const stream = await downloadContentFromMessage(m, type); let buffer = Buffer.from([]); for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]); return saveToFile ? (await conn.getFile(buffer, true)).filename : buffer; }, enumerable: true },
        cMod: {
            value(jid, message, text = "", sender = conn.user.jid, options = {}) {
                const copy = message.toJSON();
                delete copy.message.messageContextInfo;
                delete copy.message.senderKeyDistributionMessage;
                const mtype = Object.keys(copy.message)[0];
                const content = copy.message[mtype];
                if (typeof content === "string") copy.message[mtype] = text || content;
                else if (content.caption) content.caption = text || content.caption;
                else if (content.text) content.text = text || content.text;
                if (typeof content !== "string") copy.message[mtype] = { ...content, ...options, contextInfo: { ...(content.contextInfo || {}), mentionedJid: options.mentions || content.contextInfo?.mentionedJid || [] } };
                if (copy.participant) sender = copy.participant = sender || copy.participant;
                else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
                if (copy.key.remoteJid.includes("@s.whatsapp.net") || copy.key.remoteJid.includes("@broadcast")) sender = sender || copy.key.remoteJid;
                copy.key.remoteJid = jid;
                copy.key.fromMe = areJidsSameUser(sender, conn.user.id) || false;
                return proto.WebMessageInfo.fromObject(copy);
            }, enumerable: true
        },
        copyNForward: {
            async value(jid, message, forwardingScore = true, options = {}) {
                let vtype;
                if (options.readViewOnce && message.message.viewOnceMessage?.message) {
                    vtype = Object.keys(message.message.viewOnceMessage.message)[0];
                    delete message.message.viewOnceMessage.message[vtype].viewOnce;
                    message.message = proto.Message.fromObject(JSON.parse(JSON.stringify(message.message.viewOnceMessage.message)));
                    message.message[vtype].contextInfo = message.message.viewOnceMessage.contextInfo;
                }
                const mtype = Object.keys(message.message)[0];
                let m = generateForwardMessageContent(message, !!forwardingScore);
                const ctype = Object.keys(m)[0];
                if (forwardingScore && typeof forwardingScore === "number" && forwardingScore > 1) m[ctype].contextInfo.forwardingScore += forwardingScore;
                m[ctype].contextInfo = { ...(message.message[mtype].contextInfo || {}), ...(m[ctype].contextInfo || {}) };
                m = generateWAMessageFromContent(jid, m, { ...options, userJid: conn.user.jid });
                await conn.relayMessage(jid, m.message, { messageId: m.key.id });
                return m;
            }, enumerable: true
        },
        serializeM: { value(m) { return smsg(conn, m); } },
    });
}

export function smsg(conn, m) {
    if (!m) return m;
    try {
        m = proto.WebMessageInfo.fromObject(m);
        m.conn = conn;
        if (m.message && m.mtype == "protocolMessage" && m.msg?.key) {
            const key = m.msg.key;
            if (key.remoteJid === "status@broadcast") key.remoteJid = m.chat || "";
            if (!key.participant || key.participant === "status_me") key.participant = m.sender || "";
            key.fromMe = conn?.decodeJid?.(key.participant) === conn?.user?.id;
            if (!key.fromMe && key.remoteJid === conn?.user?.id) key.remoteJid = m.sender || "";
            try { conn.ev.emit("message.delete", key); } catch { }
        }
        if (m.quoted && !m.quoted.mediaMessage) delete m.quoted.download;
        if (!m.mediaMessage) delete m.download;
        return m;
    } catch { return m; }
}

export function serialize() {
    if (!proto?.WebMessageInfo?.prototype) {
        console.error("proto.WebMessageInfo.prototype no disponible");
        return;
    }
    
    Object.defineProperties(proto.WebMessageInfo.prototype, {
        conn: { value: undefined, enumerable: false, writable: true },
        id: { get() { return this.key?.id || ""; }, enumerable: true },
        isBaileys: { get() { const prefixes = ['NJX-', 'Lyru-', 'META-', 'EvoGlobalBot-', 'FizzxyTheGreat-', 'BAE5', '3EB0', 'B24E', '8SCO', 'SUKI', 'MYSTIC-']; return prefixes.some(p => this.id.startsWith(p)) || /^(SUKI|MYSTIC)[A-F0-9]+$/.test(this.id); }, enumerable: true },
        chat: { get() { return this.conn?.decodeJid(this.key?.remoteJid || this.message?.senderKeyDistributionMessage?.groupId || ""); }, enumerable: true },
        isGroup: { get() { return this.chat?.endsWith("@g.us") || false; }, enumerable: true },
        sender: { get() { return this.conn?.decodeJid(this.key?.fromMe && this.conn?.user.id || this.participant || this.key?.participant || this.chat || ''); }, enumerable: true },
        fromMe: { get() { return this.key?.fromMe || areJidsSameUser(this.conn?.user?.jid, this.sender) || false; }, enumerable: true },
        mtype: { get() { if (!this.message) return ""; const t = Object.keys(this.message); return !["senderKeyDistributionMessage", "messageContextInfo"].includes(t[0]) ? t[0] : t.length >= 3 && t[1] !== "messageContextInfo" ? t[1] : t[t.length - 1]; }, enumerable: true },
        msg: { get() { return this.message?.[this.mtype] || null; }, enumerable: true },
        mediaMessage: { get() { const m = (this.msg?.url || this.msg?.directPath ? { ...this.message } : extractMessageContent(this.message)) || null; if (!m) return null; const mtype = Object.keys(m)[0]; return MediaType.includes(mtype) ? m : null; }, enumerable: true },
        mediaType: { get() { const m = this.mediaMessage; return m ? Object.keys(m)[0] : null; }, enumerable: true },
        text: { get() { const msg = this.msg; return (typeof msg === "string" ? msg : msg?.text || msg?.caption || msg?.contentText || msg?.selectedDisplayText || msg?.hydratedTemplate?.hydratedContentText || ""); }, enumerable: true },
        mentionedJid: { get() { return this.msg?.contextInfo?.mentionedJid || []; }, enumerable: true },
        name: { get() { return this.pushName || this.conn?.getName?.(this.sender) || ""; }, enumerable: true },
        download: { value(saveToFile = false) { return this.conn?.downloadM?.(this.mediaMessage?.[this.mediaType], this.mediaType?.replace(/message/i, ""), saveToFile); }, enumerable: true, configurable: true },
        reply: { value(text, chatId, options) { return this.conn?.reply?.(chatId || this.chat, text, this, options); }, enumerable: true },
        copy: { value() { return smsg(this.conn, proto.WebMessageInfo.fromObject(proto.WebMessageInfo.toObject(this))); }, enumerable: true },
        forward: { value(jid, force = false, options = {}) { return this.conn?.sendMessage?.(jid, { forward: this, force, ...options }, { ...options }); }, enumerable: true },
        delete: { value() { return this.conn?.sendMessage?.(this.chat, { delete: this.key }); }, enumerable: true },
        react: { value(text) { return this.conn?.sendMessage(this.chat, { react: { text, key: this.key } }); }, enumerable: true }
    });
}

export function protoType() {
    Buffer.prototype.toArrayBuffer = function() { const ab = new ArrayBuffer(this.length); const view = new Uint8Array(ab); for (let i = 0; i < this.length; ++i) view[i] = this[i]; return ab; };
    ArrayBuffer.prototype.toBuffer = function() { return Buffer.from(new Uint8Array(this)); };
    Uint8Array.prototype.getFileType = ArrayBuffer.prototype.getFileType = Buffer.prototype.getFileType = async function() { return await fileTypeFromBuffer(this); };
    String.prototype.isNumber = Number.prototype.isNumber = function() { const int = parseInt(this); return typeof int === "number" && !isNaN(int); };
    String.prototype.capitalize = function() { return this.charAt(0).toUpperCase() + this.slice(1); };
    String.prototype.capitalizeV2 = function() { return this.split(" ").map(v => v.capitalize()).join(" "); };
    String.prototype.decodeJid = function() { return /:\d+@/gi.test(this) ? ((jidDecode(this) || {}).user && (jidDecode(this) || {}).server && (jidDecode(this) || {}).user + "@" + (jidDecode(this) || {}).server || this).trim() : this.trim(); };
    Number.prototype.toTimeString = function() { const s = Math.floor((this / 1000) % 60), m = Math.floor((this / 60000) % 60), h = Math.floor((this / 3600000) % 24), d = Math.floor(this / 86400000); return ((d ? `${d} day(s) ` : "") + (h ? `${h} hour(s) ` : "") + (m ? `${m} minute(s) ` : "") + (s ? `${s} second(s)` : "")).trim(); };
    Number.prototype.getRandom = String.prototype.getRandom = Array.prototype.getRandom = function() { return Array.isArray(this) || this instanceof String ? this[Math.floor(Math.random() * this.length)] : Math.floor(Math.random() * this); };
}

function nullish(args) { return !(args !== null && args !== undefined); }
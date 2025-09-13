//import { areJidsSameUser } from '@whiskeysockets/baileys';

export async function before(m, { participants, conn }) {
  if (m.isGroup) {
    let chat = global.db.data.chats[m.chat];

    if (!chat.antiBot2) {
      return
    }

    let botJid = global.conn.user.jid 

    if (botJid === conn.user.jid) {
      return
    } else {
      let isBotPresent = participants.some(p => areJidsSameUser(botJid, p.id))

      if (isBotPresent) {
        setTimeout(async () => {
          await conn.reply(m.chat, `*🌀 Aviso Importante*

> Ya hay un bot principal activo en el grupo, por lo tanto no responderé comandos para evitar interferencias.
¡Gracias por su comprensión!

`, m)

        }, 5000) 
      }
    }
  }
}

/*import { areJidsSameUser } from '@whiskeysockets/baileys'
export async function before(m, { participants, conn }) {
    if (m.isGroup) {
        let chat = global.db.data.chats[m.chat];

         if (!chat.antiBot2) {
            return
        }


        let botJid = global.conn.user.jid // JID del bot principal

       if (botJid === conn.user.jid) {
           return
        } else {
           let isBotPresent = participants.some(p => areJidsSameUser(botJid, p.id))

          if (isBotPresent) {
                setTimeout(async () => {
                    await conn.reply(m.chat, `*🌀 Aviso Importante*

> Ya hay un bot principal activo en el grupo, por lo tanto me retiro para evitar generar spam o interferencias.
¡Gracias por su comprensión!


> *sɪɢᴜᴇ ᴇʟ ᴄᴀɴᴀʟ ᴏғɪᴄɪᴀʟ:*
> whatsapp.com/channel/0029VbAzn9GGU3BQw830eA0F`, m, rcanal);
                    await this.groupLeave(m.chat)
                }, 5000)// 5 segundos
            }
        }
    }
}*/
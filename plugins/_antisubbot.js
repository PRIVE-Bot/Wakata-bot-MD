//import { areJidsSameUser } from '@whiskeysockets/baileys';

/*export async function before(m, { participants, conn }) {
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
}*/

import { areJidsSameUser } from '@whiskeysockets/baileys';

export async function before(m, { participants, conn }) {
  // Solo aplica a grupos
  if (!m.isGroup) return;

  // Obtenemos la configuración del chat
  let chat = global.db.data.chats[m.chat];
  if (!chat.antiBot2) return;

  // JID del bot principal
  let mainBotJid = global.conn.user.jid;

  // Si este es el bot principal, no hacemos nada
  if (mainBotJid === conn.user.jid) return;

  // Verificamos si hay un bot principal en el grupo
  let isMainBotPresent = participants.some(p => areJidsSameUser(mainBotJid, p.id));

  if (isMainBotPresent) {
    // Opcional: enviar aviso a los usuarios (descomenta si quieres)
    /*
    setTimeout(async () => {
      await conn.reply(m.chat, `*🌀 Aviso Importante*\n\n> Ya hay un bot principal activo en este grupo, por lo que este bot no ejecutará comandos para evitar interferencias.`, m);
    }, 2000);
    */

    // BLOQUEAMOS la ejecución de comandos de este subbot
    return true; // <- muy importante: aquí el subbot deja de procesar cualquier cosa
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
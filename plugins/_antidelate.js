import { getContentType, generateForwardMessageContent, generateWAMessageFromContent } from '@whiskeysockets/baileys';

global.delete = global.delete || [];


export async function before(m, { conn, isAdmin }) {
    if (isAdmin) return; 
    if (!m.isGroup) return; 
    if (m.key.fromMe) return; 

    let chat = global.db.data.chats[m.chat];

    if (chat.delete) {
        if (global.delete.length > 500) global.delete = []; 

        
        if (m.type !== 'protocolMessage' && m.key && m.message) {
            global.delete.push({ key: m.key, message: m.message });
        }

       
        if (m?.message?.protocolMessage) {
            let msg = global.delete.find(x => x.key.id === m.message.protocolMessage.key.id);

            if (msg) {
                
                                let quoted = {
                    key: msg.key,
                    message: {
                        extendedTextMessage: {
                            text: 'Este usuario eliminó un mensaje.'
                        }
                    }
                };

                
                await sendMessageForward(msg, {
                    client: conn,
                    from: m.chat,
                    isReadOneView: true,
                    viewOnce: false,
                    quoted
                });

                // Eliminarlo del historial
                let index = global.delete.indexOf(msg);
                if (index !== -1) global.delete.splice(index, 1);
            }
        }
    }
}

/**
 * Reenvía un mensaje preservando metadatos y menciones
 * @param {Object} msg - Mensaje original
 * @param {Object} opts - Opciones
 */
async function sendMessageForward(msg, opts = {}) {
    let originalType = getContentType(msg.message);
    let forwardContent = await generateForwardMessageContent(msg, { forwardingScore: true });
    let forwardType = getContentType(forwardContent);

    
    if (opts.text) {
        if (forwardType === 'conversation') {
            forwardContent[forwardType] = opts.text;
        } else if (forwardType === 'extendedTextMessage') {
            forwardContent[forwardType].text = opts.text;
        } else {
            forwardContent[forwardType].caption = opts.text;
        }
    }

    // Marcar como "View Once" si corresponde
    if (opts.isReadOneView) {
        forwardContent[forwardType].viewOnce = opts.viewOnce;
    }

    
    forwardContent[forwardType].contextInfo = {
        ...(msg.message[originalType]?.contextInfo || {}),
        ...(opts.mentions ? { mentionedJid: opts.mentions } : {}),
        isForwarded: opts.forward || true,
        remoteJid: opts.remote || null
    };

    
    let newMsg = await generateWAMessageFromContent(opts.from, forwardContent, {
        userJid: opts.client.user.id,
        quoted: opts.quoted || msg
    });

    await opts.client.relayMessage(
        opts.from,
        newMsg.message,
        { messageId: newMsg.key.id }
    );

    return newMsg;
}
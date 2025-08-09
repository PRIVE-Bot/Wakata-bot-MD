

const registry = new Map(); // msgId -> { emojiMap: Map(emoji -> { callbacks:[], options, timeoutId }) }
let __conn = null;
let __debug = false;

function debugLog(...args) {
  if (__debug) console.log('[reactionHandler]', ...args);
}

function init(conn, opts = {}) {
  if (!conn) throw new Error('reactionHandler.init requiere la conexión de Baileys (conn).');
  if (conn.__reactionHandlerInitialized) return;
  __conn = conn;
  __debug = !!opts.debug;
  conn.__reactionHandlerInitialized = true;

  // messages.upsert (forma más común)
  conn.ev.on('messages.upsert', async (up) => {
    try {
      const messages = up.messages ?? [];
      for (const m of messages) {
        handleUpsertMessage(m);
      }
    } catch (e) {
      console.error('reactionHandler upsert error', e);
    }
  });

  // messages.update (otra posible forma de reacción)
  conn.ev.on('messages.update', async (updates) => {
    try {
      for (const u of updates) {
        handleUpdateEntry(u);
      }
    } catch (e) {
      console.error('reactionHandler update error', e);
    }
  });

  debugLog('initialized');
}

async function handleUpsertMessage(m) {
  try {
    if (!m) return;
    // variante estándar
    const reactionMessage = m.message?.reactionMessage;
    if (reactionMessage) {
      const emoji = reactionMessage.text;
      const reactedMsgId = reactionMessage.key?.id;
      const chatId = m.key?.remoteJid;
      const by = m.key?.participant ?? m.participant ?? (m.key?.fromMe ? (__conn?.user?.id ?? __conn?.user?.jid) : undefined);
      processReaction({ chatId, by, emoji, reactedMsgId, raw: m });
      return;
    }

    // en algunos casos la reacción puede venir en m.message?.reaction
    const altReaction = m.message?.reaction;
    if (altReaction) {
      const emoji = altReaction.text;
      const reactedMsgId = altReaction.key?.id;
      const chatId = m.key?.remoteJid;
      const by = m.key?.participant ?? m.participant;
      processReaction({ chatId, by, emoji, reactedMsgId, raw: m });
      return;
    }
  } catch (err) {
    console.error('handleUpsertMessage error', err);
  }
}

async function handleUpdateEntry(u) {
  try {
    // estructura: { key, update: { reaction: { text, key: { id } } } }
    const reaction = u.update?.reaction ?? u.update?.reactions ?? null;
    if (reaction) {
      const emoji = reaction.text;
      const reactedMsgId = reaction.key?.id;
      const chatId = u.key?.remoteJid;
      const by = u.key?.participant ?? u.participant;
      processReaction({ chatId, by, emoji, reactedMsgId, raw: u });
      return;
    }
  } catch (err) {
    console.error('handleUpdateEntry error', err);
  }
}

async function processReaction({ chatId, by, emoji, reactedMsgId, raw }) {
  try {
    if (!reactedMsgId || !emoji) return;
    const entry = registry.get(reactedMsgId);
    if (!entry) {
      debugLog('no registry for', reactedMsgId, emoji);
      return;
    }
    const handlerObj = entry.emojiMap.get(emoji);
    if (!handlerObj) {
      debugLog('emoji no registrado para este msgId:', emoji);
      return;
    }

    // si onlyFrom está definido, comparar quien reaccionó
    if (handlerObj.options?.onlyFrom) {
      // handlerObj.options.onlyFrom puede ser JID o array de JIDs
      const allowed = handlerObj.options.onlyFrom;
      const allowedList = Array.isArray(allowed) ? allowed : [allowed];
      if (!by || !allowedList.includes(by)) {
        debugLog('reacción ignorada por onlyFrom. by=', by, 'allowed=', allowedList);
        return;
      }
    }

    // ejecutar callbacks (serie)
    for (const cb of handlerObj.callbacks) {
      try {
        await cb({ chatId, by, emoji, msgId: reactedMsgId, conn: __conn, raw });
      } catch (err) {
        console.error('reaction callback error', err);
      }
    }

    // si once=true, eliminar esa reacción
    if (handlerObj.options?.once) {
      entry.emojiMap.delete(emoji);
      debugLog('se removió registro once para', reactedMsgId, emoji);
      clearTimeout(handlerObj.timeoutId);
    }

    // si ya no hay emojis en ese msg, borrar el registro completo
    if (entry.emojiMap.size === 0) {
      registry.delete(reactedMsgId);
      debugLog('registro completo eliminado para msgId', reactedMsgId);
    }
  } catch (e) {
    console.error('processReaction error', e);
  }
}

/**
 * register(msgId, emoji, callback, options)
 * options: { timeout: ms, onlyFrom: '12345@s.whatsapp.net' | ['a','b'], once: boolean }
 */
function register(msgId, emoji, callback, options = {}) {
  if (!msgId) throw new Error('register requiere msgId');
  if (!emoji) throw new Error('register requiere emoji');
  if (typeof callback !== 'function') throw new Error('register requiere callback función');

  let entry = registry.get(msgId);
  if (!entry) {
    entry = { emojiMap: new Map() };
    registry.set(msgId, entry);
  }
  let handlerObj = entry.emojiMap.get(emoji);
  if (!handlerObj) {
    handlerObj = { callbacks: [], options: {} };
    entry.emojiMap.set(emoji, handlerObj);
  }

  handlerObj.callbacks.push(callback);
  handlerObj.options = { ...(handlerObj.options || {}), ...(options || {}) };

  // manejar timeout por emoji (si se pide)
  if (options?.timeout && options.timeout > 0) {
    if (handlerObj.timeoutId) clearTimeout(handlerObj.timeoutId);
    handlerObj.timeoutId = setTimeout(() => {
      // al expirar, eliminar ese emoji
      const e = registry.get(msgId);
      if (e) {
        e.emojiMap.delete(emoji);
        debugLog('timeout expired -> removed', msgId, emoji);
        if (e.emojiMap.size === 0) registry.delete(msgId);
      }
    }, options.timeout);
  }

  debugLog('registered', { msgId, emoji, options });
}

/**
 * unregister(msgId, emoji?)
 */
function unregister(msgId, emoji) {
  if (!msgId) return;
  const entry = registry.get(msgId);
  if (!entry) return;
  if (!emoji) {
    // remove all
    for (const [em, obj] of entry.emojiMap) {
      if (obj.timeoutId) clearTimeout(obj.timeoutId);
    }
    registry.delete(msgId);
    debugLog('unregistered all for', msgId);
    return;
  }
  const obj = entry.emojiMap.get(emoji);
  if (!obj) return;
  if (obj.timeoutId) clearTimeout(obj.timeoutId);
  entry.emojiMap.delete(emoji);
  debugLog('unregistered', msgId, emoji);
  if (entry.emojiMap.size === 0) registry.delete(msgId);
}

/**
 * Helper: send a message and register multiple reactions in one call
 * reactions: [{ emoji, callback, options }]
 */
async function sendAndRegister(chatId, message, reactions = []) {
  if (!__conn) throw new Error('reactionHandler no inicializado (init)');
  const sent = await __conn.sendMessage(chatId, message);
  const msgId = sent?.key?.id;
  if (!msgId) {
    debugLog('sendAndRegister: no msgId en la respuesta de sendMessage', sent);
    return { sent, msgId: null };
  }
  for (const r of reactions) {
    register(msgId, r.emoji, r.callback, r.options);
  }
  return { sent, msgId };
}

export default {
  init,
  register,
  unregister,
  sendAndRegister,
  // utilidad sólo lectura para debug si lo necesitas
  _registry: () => registry
};
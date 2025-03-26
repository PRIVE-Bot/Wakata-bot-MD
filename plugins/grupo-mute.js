/** By @MoonContentCreator || https://github.com/MoonContentCreator/BixbyBot-Md **/
const _0x5b4011 = _0x1e46;
(function (_0x5d5f48, _0x19a8da) {
    const _0x158a14 = _0x1e46;
    const _0x3cfdf1 = _0x5d5f48();
    while (!![]) {
        try {
            const _0x1183ac = parseInt(_0x158a14(0x156)) / 0x1 + -parseInt(_0x158a14(0x14b)) / 0x2 + -parseInt(_0x158a14(0x159)) / 0x3 * (parseInt(_0x158a14(0x148)) / 0x4) + parseInt(_0x158a14(0x13d)) / 0x5 + -parseInt(_0x158a14(0x150)) / 0x6 + -parseInt(_0x158a14(0x15a)) / 0x7 * (-parseInt(_0x158a14(0x14c)) / 0x8) + parseInt(_0x158a14(0x151)) / 0x9 * (-parseInt(_0x158a14(0x15c)) / 0xa);
            if (_0x1183ac === _0x19a8da) break;
            else _0x3cfdf1.push(_0x3cfdf1.shift());
        } catch (_0x2b24bf) {
            _0x3cfdf1.push(_0x3cfdf1.shift());
        }
    }
}(_0x2d65, 0x8b32d));

import _0x19a3e4 from 'node-fetch';

function _0x1e46(_0x301c1c, _0x5d24cd) {
    const _0x2d65df = _0x2d65();
    return _0x1e46 = function (_0x1e46ec, _0x23712a) {
        _0x1e46ec = _0x1e46ec - 0x136;
        let _0x3f6ee7 = _0x2d65df[_0x1e46ec];
        return _0x3f6ee7;
    }, _0x1e46(_0x301c1c, _0x5d24cd);
}

const handler = async (_0x5b04ea, { conn: _0x24d45b, command: _0x38ad25, text: _0x29b0ac, isAdmin: _0x9e35ac }) => {
    const _0x267b7e = _0x1e46;
    if (_0x38ad25 === _0x267b7e(0x139)) {
        if (!_0x9e35ac) throw '👑 *Solo un administrador puede ejecutar este comando';
        const _0x45f556 = global['owner'][0x0][0x0] + _0x267b7e(0x140);
        if (_0x5b04ea[_0x267b7e(0x13e)][0x0] === _0x45f556) throw _0x267b7e(0x158);
        let _0x329969 = _0x5b04ea[_0x267b7e(0x13e)][0x0] ? _0x5b04ea['mentionedJid'][0x0] : _0x5b04ea[_0x267b7e(0x154)] ? _0x5b04ea[_0x267b7e(0x154)][_0x267b7e(0x142)] : _0x29b0ac;
        if (_0x329969 === _0x24d45b[_0x267b7e(0x136)][_0x267b7e(0x153)]) throw _0x267b7e(0x144);
        const _0xeea06e = await _0x24d45b[_0x267b7e(0x14e)](_0x5b04ea['chat']);
        const _0x69b64a = _0xeea06e[_0x267b7e(0x15e)] || _0x5b04ea[_0x267b7e(0x152)].split`-`[0x0] + _0x267b7e(0x140);
        if (_0x5b04ea[_0x267b7e(0x13e)][0x0] === _0x69b64a) throw _0x267b7e(0x14f);
        let _0xc6ae1d = global['db'][_0x267b7e(0x15b)][_0x267b7e(0x15d)][_0x329969];
        const _0x3d4fa1 = {
            'key': {
                'participants': _0x267b7e(0x146),
                'fromMe': ![],
                'id': _0x267b7e(0x13b)
            },
            'message': {
                'locationMessage': {
                    'name': _0x267b7e(0x13c),
                    'jpegThumbnail': await (await _0x19a3e4('https://telegra.ph/file/f8324d9798fa2ed2317bc.png')).buffer(),
                    'vcard': 'BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD'
                }
            },
            'participant': _0x267b7e(0x146)
        };
        const _0x1385c9 = _0x267b7e(0x14a);
        if (!_0x5b04ea[_0x267b7e(0x13e)][0x0] && !_0x5b04ea['quoted']) return _0x24d45b[_0x267b7e(0x141)](_0x5b04ea['chat'], _0x1385c9, _0x5b04ea);
        if (_0xc6ae1d[_0x267b7e(0x13a)] === !![]) throw _0x267b7e(0x14d);
        _0x24d45b['reply'](_0x5b04ea[_0x267b7e(0x152)], _0x267b7e(0x137), _0x3d4fa1, null, { 'mentions': [_0x329969] });
        global['db'][_0x267b7e(0x15b)][_0x267b7e(0x15d)][_0x329969][_0x267b7e(0x13a)] = !![];
    } else {
        if (_0x38ad25 === _0x267b7e(0x147)) {
            if (!_0x9e35ac) throw _0x5b04ea[_0x267b7e(0x141)](_0x267b7e(0x155));
            let _0x12128f = _0x5b04ea['mentionedJid'][0x0] ? _0x5b04ea[_0x267b7e(0x13e)][0x0] : _0x5b04ea[_0x267b7e(0x154)] ? _0x5b04ea[_0x267b7e(0x154)][_0x267b7e(0x142)] : _0x29b0ac;
            let _0x498844 = global['db'][_0x267b7e(0x15b)]['users'][_0x12128f];
            const _0x2d1dfb = {
                'key': {
                    'participants': _0x267b7e(0x146),
                    'fromMe': ![],
                    'id': _0x267b7e(0x13b)
                },
                'message': {
                    'locationMessage': {
                        'name': _0x267b7e(0x143),
                        'jpegThumbnail': await (await _0x19a3e4('https://telegra.ph/file/aea704d0b242b8c41bf15.png')).buffer(),
                        'vcard': _0x267b7e(0x138)
                    }
                },
                'participant': _0x267b7e(0x146)
            };
            const _0x294b70 = _0x267b7e(0x13f);
            if (_0x12128f === _0x5b04ea[_0x267b7e(0x142)]) throw _0x267b7e(0x157);
            if (!_0x5b04ea['mentionedJid'][0x0] && !_0x5b04ea[_0x267b7e(0x154)]) return _0x24d45b[_0x267b7e(0x141)](_0x5b04ea[_0x267b7e(0x152)], _0x294b70, _0x5b04ea);
            if (_0x498844[_0x267b7e(0x13a)] === ![]) throw _0x267b7e(0x149);
            global['db'][_0x267b7e(0x15b)][_0x267b7e(0x15d)][_0x12128f][_0x267b7e(0x13a)] = ![];
            _0x24d45b[_0x267b7e(0x141)](_0x5b04ea[_0x267b7e(0x152)], '*Tus mensajes no serán eliminados*', _0x2d1dfb, null, { 'mentions': [_0x12128f] });
        }
    }
};

function _0x2d65() {
    const _0x1338ed = ['👑 *Sólo otro administrador puede desmutarte*', '👑 *El creador del bot no puede ser mutado*', '129PEBBUv', '51289OMfQvC', 'data', '9070eQsjRl', 'users', 'owner', 'user', '*Tus mensajes serán eliminados*', 'BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD', 'mute', 'muto', 'Halo', '𝗨𝘀𝘂𝗮𝗿𝗶𝗼 mutado', '3136705kmgDtk', 'mentionedJid', '🔥 *Menciona a la persona que deseas demutar*', '@s.whatsapp.net', 'reply', 'sender', '𝗨𝘀𝘂𝗮𝗿𝗶𝗼 demutado', '🔥 *No puedes mutar el bot*', 'group', '0@s.whatsapp.net', 'unmute', '14340DPskXA', '🔥 *Este usuario no ha sido mutado*', '👑 *Menciona a la persona que deseas mutar*', '472398wcTpbo', '848XQksSy', '🔥 *Este usuario ya ha sido mutado*', 'groupMetadata', '🔥 *No puedes mutar el creador del grupo*', '6547128nviniQ', '3051obNcjV', 'chat', 'jid', 'quoted', '🔥 *Solo un administrador puede ejecutar este comando', '955169UoGRsU'];
    _0x2d65 = function () { return _0x1338ed; };
    return _0x2d65();
}

handler['command'] = ['mute', 'unmute'];
handler[_0x5b4011(0x145)] = !![];
handler['admin'] = !![];
handler['botAdmin'] = !![];
export default handler;
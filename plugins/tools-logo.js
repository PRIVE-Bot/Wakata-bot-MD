//© Código hecho por Deylin  

import _0x1a3c5e from'axios';

const _0x2b4d71=['3D','Winner','smurfs','wrooom','fabulous','fire','Fluffy','Glow','neon','summer','flaming','Retro'];

async function _0x5c2a6d(_0x3d9e6d,_0x5c9fd5,_0x2d26ff,_0x1e26c8){try{await _0x1e26c8.sendMessage(_0x2d26ff.chat,{text:'🚀 Generando tu logo, espera un momento...'}, {quoted:_0x2d26ff});const _0x21a3f9=`https://flamingtext.com/net-fu/proxy_form.cgi?imageoutput=true&script=${_0x3d9e6d}-logo&text=${encodeURIComponent(_0x5c9fd5)}`;await _0x1e26c8.sendMessage(_0x2d26ff.chat,{image:{url:_0x21a3f9},caption:`${emoji} Resultado de *${_0x5c9fd5}*`}, {quoted:_0x2d26ff})}catch(_0x42bc5e){console.error('Error al generar el logo:',_0x42bc5e);await _0x1e26c8.sendMessage(_0x2d26ff.chat,{text:'${emoji6} Error al generar el logo. Prueba con otro estilo.'},{quoted:_0x2d26ff})}}

const _0x4e1b7e=async(_0x52c167,{conn:_0x282374,args:_0x17df43,command:_0x3f1c56})=>{if(_0x3f1c56!=='logo'){return _0x282374.sendMessage(_0x52c167.chat,{text:'${emoji} El comando no existe.'},{quoted:_0x52c167})}if(!_0x17df43||_0x17df43.length<2){const _0x3cfa48=`${emoji} Ejemplo: /logo neon Kirito-Bot\n\nEstilos disponibles:\n- 3D\n- Winner\n- smurfs\n- wrooom\n- fabulous\n- fire\n- Fluffy\n- Glow\n- neon\n- summer\n- flaming\n- Retro`;return _0x282374.sendMessage(_0x52c167.chat,{text:`${emoji} Uso incorrecto.\n\n${_0x3cfa48}`},{quoted:_0x52c167})}const _0x51421a=_0x17df43[0].toLowerCase(),_0x410eb7=_0x17df43.slice(1).join(' ');if(!_0x2b4d71.map(_0x3b752e=>_0x3b752e.toLowerCase()).includes(_0x51421a)){return _0x282374.sendMessage(_0x52c167.chat,{text:`${emoji6} El estilo *${_0x51421a}* no está disponible.\n\nEstilos disponibles:\n- ${_0x2b4d71.join('\n- ')}`},{quoted:_0x52c167})}await _0x5c2a6d(_0x51421a,_0x410eb7,_0x52c167,_0x282374)};

_0x4e1b7e.help=['logo'];
_0x4e1b7e.tags=['fun'];
_0x4e1b7e.command=['logo'];
_0x4e1b7e.group=true;

export default _0x4e1b7e;
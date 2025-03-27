//© Código hecho por Deylin  

import axios from 'axios';

const estilosDisponibles = [
    '3D', 'Winner', 'smurfs', 'wrooom', 'fabulous', 
    'fire', 'Fluffy', 'Glow', 'neon', 'summer', 
    'flaming', 'Retro'
];

(async()=>{const e=["3D","Winner","smurfs","wrooom","fabulous","fire","Fluffy","Glow","neon","summer","flaming","Retro"];async function o(o,t,n,a){try{await a.sendMessage(n.chat,{text:"⏳ Generando tu logo, espera un momento..."},{quoted:n});const c=`https://flamingtext.com/net-fu/proxy_form.cgi?imageoutput=true&script=${o}-logo&text=${encodeURIComponent(t)}`;await a.sendMessage(n.chat,{image:{url:c},caption:`✨ Resultado de *${t}*`},{quoted:n})}catch(e){console.error("Error al generar el logo:",e),await a.sendMessage(n.chat,{text:"❌ Error al generar el logo. Prueba con otro estilo."},{quoted:n})}}const t=async(t,{conn:n,args:a,command:c})=>{if("logo"!==c)return n.sendMessage(t.chat,{text:"⚠️ El comando no existe."},{quoted:t});if(!a||a.length<2){const c="📌 *Ejemplo:* /logo neon Kirito-Bot\n\n✅ *Estilos disponibles:*\n- 3D\n- Winner \n- smurfs \n- wrooom\n- fabulous\n- fire\n- Fluffy \n- Glow\n- neon\n- summer\n- flaming \n- Retro";return n.sendMessage(t.chat,{text:`⚠️ Uso incorrecto.\n\n${c}`},{quoted:t})}const s=a[0].toLowerCase(),i=a.slice(1).join(" ");if(!e.map(e=>e.toLowerCase()).includes(s))return n.sendMessage(t.chat,{text:`❌ El estilo *${s}* no está disponible.\n\n✅ *Estilos disponibles:*\n- ${e.join("\n- ")}`},{quoted:t});await o(s,i,t,n)};t.help=["logo"],t.tags=["fun"],t.command=["logo"],t.group=!0,export default t})();
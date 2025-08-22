<!-- Banner superior -->
<img src="https://capsule-render.vercel.app/api?type=waving&height=260&section=header&text=Naruto-Bot%20MD&fontSize=60&fontAlign=50&fontAlignY=35&color=0:F68512,50:1B2A49,100:000000&stroke=000000&strokeWidth=1&fontColor=FFFFFF&textBg=true" width="100%"/>

> [!TIP]
> ## **`🚧 En desarrollo... ↻`**
> Este proyecto está en constante mejora y optimización.  
> Próximamente más funciones, mejor rendimiento y nuevos comandos.

<h1 align="center"> 🌀 Naruto-Bot-MD 🌀 </h1>

---

> [!NOTE]
> <p align="center">
>   <img src="https://files.catbox.moe/0183v7.png" alt="Menú Principal" width="85%">
> </p>
> Bot de WhatsApp basado en **Baileys MD** con estilo **Naruto** — estable, rápido y con comandos avanzados.

---

> [!CAUTION]  
> **📜 Este repositorio está protegido por una [licencia propietaria](LICENSE).**  
> 🚫 Queda prohibido clonar, copiar, modificar, distribuir o reutilizar el código sin autorización del autor.

---

<!-- Texto animado -->
<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?size=26&duration=2300&pause=600&center=true&vCenter=true&width=900&lines=Bienvenido+al+mundo+shinobi;Conexi%C3%B3n+por+QR+y+Emparejamiento;Comandos+avanzados+y+veloces;By+Deylin" />
</p>

<!-- Badges -->
<p align="center">
  <a href="https://whatsapp.com/channel/0029VbB46nl2ER6dZac6Nd1o">
    <img src="https://img.shields.io/badge/Canal%20Oficial-WhatsApp-25D366?logo=whatsapp&logoColor=white" />
  </a>
  <img src="https://img.shields.io/badge/Naruto%20Style-F68512?logo=firefox&logoColor=white" />
  <img src="https://img.shields.io/badge/Baileys-WhatsApp%20MD-1B2A49?logo=whatsapp&logoColor=white" />
  <a href="https://ko-fi.com/naruto_bot">
    <img src="https://ko-fi.com/img/githubbutton_sm.svg" alt="Apóyame en Ko-fi"/>
  </a>
</p>

<!-- Banner inferior -->
<img src="https://capsule-render.vercel.app/api?type=waving&height=140&section=footer&color=0:000000,50:1B2A49,100:F68512" width="100%"/>



# **ESTILO PRODUCTO**
```
const res = await fetch('url');
const img = Buffer.from(await res.arrayBuffer());

const fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        productMessage: {
            product: {
                productImage: { jpegThumbnail: img },
                title: `texto`,
                description: botname ,
                currencyCode: "USD",
                priceAmount1000: "5000", 
                retailerId: "BOT"
            },
            businessOwnerJid: "0@s.whatsapp.net"
        }
    }
};
```


# **ESTILO DOCUMENTO**
```
const res = await fetch('url');
const thumb2 = Buffer.from(await res1.arrayBuffer());

const fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        documentMessage: {
            title: botname,
            fileName: `texto`,
            jpegThumbnail: thumb2
        }
    }
}
```

# **ESTILO ORDEN DE PRODUCTO**
```
const res = await fetch('url');
const thumb2 = Buffer.from(await res1.arrayBuffer());

    const fkontak = {
      key: { fromMe: false, participant: "0@s.whatsapp.net" },
      message: {
        orderMessage: {
          itemCount: 1,
          status: 1,
          surface: 1,
          message: `texto`,
          orderTitle: "Mejor Bot",
          jpegThumbnail: thumb2
        }
      }
    };
```


# **ESTILO SIMULACIÓN DE ETIQUETA A MENSAJE NORMAL**
```
const res = await fetch('URL');
  const thumb2 = Buffer.from(await res.arrayBuffer());

  
  const fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
      imageMessage: {
        mimetype: 'image/jpeg',
        caption: 'TEXTO',
        jpegThumbnail: thumb2
      }
    }
  };
```




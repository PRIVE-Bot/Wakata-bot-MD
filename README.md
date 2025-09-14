<!-- Banner superior -->
<img src="https://capsule-render.vercel.app/api?type=waving&height=260&section=header&text=Obito-Bot&fontSize=60&fontAlign=50&fontAlignY=35&color=0:F68512,50:1B2A49,100:000000&stroke=000000&strokeWidth=1&fontColor=FFFFFF&textBg=true" width="100%"/>


---

> [!NOTE]
> <p align="center">
>   <img src="https://i.postimg.cc/8kWYFx5N/1756189788406.jpg" alt="Menú Principal" width="85%">
> </p>

---

> [!CAUTION]  
> **📜 Este repositorio está protegido por una [licencia propietaria](LICENSE).**  
> 🚫 Queda prohibido clonar, copiar, modificar, distribuir o reutilizar el código sin autorización del autor.

---

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




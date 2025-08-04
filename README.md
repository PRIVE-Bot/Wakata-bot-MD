> ## **`versión: Beta`**

<h1 align="center"> Naruto-Bot-MD</h1>

---
<p align="center">
  <img src="https://files.catbox.moe/0183v7.png" alt="Menú Principal">
</p>  

---

> [!NOTE]
> 🌀 *Naruto-Bot es un bot basado en Baileys para WhatsApp.*
> Es fácil de usar, personalizable y no requiere APIs de pago.

> [!NOTE]
> 📁 La estructura del bot es modular.
> Puedes editar comandos en la carpeta `plugins/` sin afectar el sistema central.

> [!IMPORTANT]
> ⚠️ Asegúrate de tener Node.js v18 o superior antes de iniciar el bot.

> [!IMPORTANT]
> 📌 El bot no es oficial de WhatsApp. Usa una cuenta secundaria para evitar baneos.

> [!TIP]
> 🍜 ¿Quieres personalizar el nombre del bot?
> Edita `config.js` y `main-allfake.js`en el archivo de configuración principal.

> [!TIP]
> 🔧 Puedes usar MongoDB o LowDB como base de datos.
> Ajusta esto en el archivo `config.js`.

> [!WARNING]
> ⚠️ ¡No uses el bot con tu número personal!
> WhatsApp podría banear tu cuenta si detecta comportamiento automatizado.

> [!WARNING]
> 🛑 Nunca compartas tu archivo de sesión (auth file) públicamente.
> Contiene acceso completo a tu cuenta de WhatsApp.

<div id="paypal-button-container-P-8683919343236382TNCIB6UI"></div>
<script src="https://www.paypal.com/sdk/js?client-id=AWJzpGhWX1FeUWD7PwEGNktnpLCINbZlbA5gngPA5_d2R7eGe2CDU-xUagSs3h69HgWi0uJ748URcCMG&vault=true&intent=subscription" data-sdk-integration-source="button-factory"></script>
<script>
  paypal.Buttons({
      style: {
          shape: 'rect',
          color: 'blue',
          layout: 'vertical',
          label: 'subscribe'
      },
      createSubscription: function(data, actions) {
        return actions.subscription.create({
          /* Creates the subscription */
          plan_id: 'P-8683919343236382TNCIB6UI'
        });
      },
      onApprove: function(data, actions) {
        alert(data.subscriptionID); // You can add optional success message for the subscriber here
      }
  }).render('#paypal-button-container-P-8683919343236382TNCIB6UI'); // Renders the PayPal button
</script>
async function enviarDatos(event) {
  event.preventDefault();

  const form = event.target;
  const datos = {
    nombre: form.nombre.value,
    whatsapp: form.whatsapp.value,
    correo: form.correo.value,
    horario: form.horario.value
  };

  const mensaje = document.getElementById("loading-message");
  mensaje.style.display = "block";
  mensaje.textContent = "Enviando datos...";

  try {
    const respuesta = await fetch("https://script.google.com/macros/s/AKfycbzk-Md6y6yOANbW-XV4IBRnm18PutQgPksHgvGDGLJtfG_GyjY9O5jIUHznyYoSy9A/exec", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    });

    mensaje.textContent = "✅ Datos enviados correctamente. Te contactaremos pronto.";
    form.reset();
  } catch (error) {
    console.error(error);
    mensaje.textContent = "❌ Hubo un error al enviar los datos. Por favor, revisa tu conexión.";
  }
}
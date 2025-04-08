let isSubmitting = false;  // Evitar envíos repetidos

async function enviarDatos(event) {
    event.preventDefault();

    if (isSubmitting) return;
    isSubmitting = true;

    const form = event.target;
    const nombre = form.nombre.value.trim();
    const whatsapp = form.whatsapp.value.trim();
    const correo = form.correo.value.trim();
    const horario = form.horario.value;

    // Validaciones
    if (!nombre || !whatsapp || !correo || !horario) {
        alert("Por favor, completa todos los campos antes de enviar el formulario.");
        isSubmitting = false;
        return;
    }

    const whatsappPattern = /^\+?\d{1,15}$/;
    if (!whatsappPattern.test(whatsapp)) {
        alert("Por favor, ingresa un número de WhatsApp válido.");
        isSubmitting = false;
        return;
    }

    const emailPattern = /^[^@]+@[^@]+\.[^@]+$/;
    if (!emailPattern.test(correo)) {
        alert("Por favor, ingresa un correo electrónico válido.");
        isSubmitting = false;
        return;
    }

    const horariosPermitidos = ['mañana', 'tarde', 'noche'];
    if (!horariosPermitidos.includes(horario.toLowerCase())) {
        alert("Por favor, selecciona un horario válido (mañana, tarde o noche).");
        isSubmitting = false;
        return;
    }

    const mensajeWA = `Hola David, soy ${encodeURIComponent(nombre)}. Me interesa ahorrar en mi factura.%0AMi WhatsApp: ${encodeURIComponent(whatsapp)}%0ACorreo: ${encodeURIComponent(correo)}%0AHorario: ${encodeURIComponent(horario)}`;
    const urlWA = `https://wa.me/34660621834?text=${encodeURIComponent(mensajeWA)}`;

    const loadingMessage = document.getElementById("loading-message");
    if (loadingMessage) loadingMessage.style.display = "block";

    const botonEnviar = form.querySelector("button[type='submit']");
    botonEnviar.innerHTML = "Enviando...";
    botonEnviar.disabled = true;

    const timeout = setTimeout(() => {
        alert("El tiempo de espera ha expirado. Por favor, intenta nuevamente.");
        isSubmitting = false;
        botonEnviar.innerHTML = "Enviar";
        botonEnviar.disabled = false;
    }, 10000);

    let data = null;

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbzOoKBWQ7PotomqBgYwxrA9hG-CUqIBARdi1DL-iWZow0E2tzF9du8VLFV5ITOQNmQ/exec', {
            method: 'POST',
            body: new FormData(form),
        });

        clearTimeout(timeout);

        if (!response.ok) throw new Error('No se pudo procesar la solicitud.');

        data = await response.json();

        if (data.success) {
            if (loadingMessage) {
                loadingMessage.innerHTML = "¡Gracias! Tu solicitud ha sido recibida. Redirigiendo...";
            }

            setTimeout(() => {
                window.open(urlWA, "_blank");
            }, 500);
        } else {
            alert("Hubo un problema con el envío, por favor intente nuevamente.");
        }
    } catch (error) {
        console.error('Error al enviar los datos:', error);
        alert("Hubo un error al enviar los datos. Verifica tu conexión e intenta de nuevo.");
    } finally {
        if (loadingMessage) loadingMessage.style.display = "none";
        botonEnviar.innerHTML = "Enviar";
        botonEnviar.disabled = false;
        isSubmitting = false;

        if (data && data.success) {
            form.reset();
        }
    }
}

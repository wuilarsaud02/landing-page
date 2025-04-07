let isSubmitting = false;  // Evitar envíos repetidos

async function enviarDatos(event) {
    event.preventDefault();

    if (isSubmitting) return; // Si ya está enviando, no hacer nada
    isSubmitting = true;

    const form = event.target;
    const nombre = form.nombre.value.trim();
    const whatsapp = form.whatsapp.value.trim();
    const correo = form.correo.value.trim();
    const horario = form.horario.value.trim();

    // Validar que los campos no estén vacíos
    if (!nombre || !whatsapp || !correo || !horario) {
        alert("Por favor, completa todos los campos antes de enviar el formulario.");
        isSubmitting = false;
        return;
    }

    // Validar formato de WhatsApp (solo números y prefijo internacional +)
    const whatsappPattern = /^\+?\d{1,15}$/;
    if (!whatsappPattern.test(whatsapp)) {
        alert("Por favor, ingresa un número de WhatsApp válido.");
        isSubmitting = false;
        return;
    }

    // Validar formato de correo electrónico
    const emailPattern = /^[^@]+@[^@]+\.[^@]+$/;
    if (!emailPattern.test(correo)) {
        alert("Por favor, ingresa un correo electrónico válido.");
        isSubmitting = false;
        return;
    }

    // Validar horario (ahora aceptamos las opciones de texto: mañana, tarde, noche)
    const horariosPermitidos = ['mañana', 'tarde', 'noche'];
    if (horario && !horariosPermitidos.includes(horario.toLowerCase())) {
        alert("Por favor, ingresa un horario válido (mañana, tarde, noche).");
        isSubmitting = false;
        return;
    }

    const mensajeWA = `Hola David, soy ${encodeURIComponent(nombre)}. Me interesa ahorrar en mi factura.%0AMi WhatsApp: ${encodeURIComponent(whatsapp)}%0ACorreo: ${encodeURIComponent(correo)}%0AHorario: ${encodeURIComponent(horario)}`;
    const urlWA = `https://wa.me/34660621834?text=${encodeURIComponent(mensajeWA)}`;

    // Mostrar un mensaje de carga mientras se envían los datos
    const loadingMessage = document.getElementById("loading-message");
    if (loadingMessage) {
        loadingMessage.style.display = "block";
    }

    // Deshabilitar el botón de envío mientras se procesan los datos
    const botonEnviar = form.querySelector("button[type='submit']");
    botonEnviar.innerHTML = "Enviando...";
    botonEnviar.disabled = true;

    // Establecer un tiempo de espera para la solicitud
    const timeout = setTimeout(() => {
        alert("El tiempo de espera ha expirado. Por favor, intenta nuevamente.");
        isSubmitting = false;
        botonEnviar.innerHTML = "Enviar";
        botonEnviar.disabled = false;
    }, 10000); // 10 segundos de espera

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbzZ2uQdbbINKyRro0qSTrTN3AHdq9TBmVX69pDCRnBvmRS42Lrh9zNJC_VZH7JYZ-Q/exec', {
            method: 'POST',
            body: new FormData(form),
        });

        clearTimeout(timeout); // Limpiar el timeout si la respuesta llega a tiempo
        if (!response.ok) {
            throw new Error('No se pudo procesar la solicitud. Intenta nuevamente.');
        }

        const data = await response.json(); 

        if (data.success) { // Si Google Script devuelve un campo 'success'
            // Mostrar un mensaje de éxito temporal
            if (loadingMessage) {
                loadingMessage.innerHTML = "¡Gracias! Tu solicitud ha sido recibida. Redirigiendo...";
            }

            // Redirigir a WhatsApp después de un breve retraso
            setTimeout(() => {
                window.open(urlWA, "_blank");
            }, 500);
        } else {
            alert("Hubo un problema con el envío, por favor intente nuevamente.");
        }
    } catch (error) {
        console.error('Error al enviar los datos:', error);
        alert("Hubo un error al enviar los datos. Por favor, asegúrate de tener conexión a internet y vuelve a intentarlo.");
    } finally {
        // Volver a habilitar el botón y ocultar el mensaje de carga
        if (loadingMessage) {
            loadingMessage.style.display = "none";
        }
        botonEnviar.innerHTML = "Enviar";
        botonEnviar.disabled = false;
        isSubmitting = false;

        // Reiniciar el formulario después del envío exitoso
        if (data && data.success) {
            form.reset();
        }
    }
}

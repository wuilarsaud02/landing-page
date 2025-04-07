function enviarDatos(event) {
    event.preventDefault();

    const form = event.target;
    const nombre = form.nombre.value;
    const whatsapp = form.whatsapp.value;
    const correo = form.correo.value;
    const horario = form.horario.value;

    // Validar que los campos no estén vacíos
    if (!nombre || !whatsapp || !correo || !horario) {
        alert("Por favor, completa todos los campos antes de enviar el formulario.");
        return;
    }

    const mensajeWA = `Hola David, soy ${nombre}. Me interesa ahorrar en mi factura.%0AMi WhatsApp: ${whatsapp}%0ACorreo: ${correo}%0AHorario: ${horario}`;
    const urlWA = `https://wa.me/34660621834?text=${encodeURIComponent(mensajeWA)}`;

    // Mostrar un mensaje de carga mientras se envían los datos
    const loadingMessage = document.getElementById("loading-message");
    loadingMessage.style.display = "block";

    // Enviar los datos a Google Script (o cualquier otra URL configurada para recibir los datos)
    fetch('https://script.google.com/macros/s/AKfycbzZ2uQdbbINKyRro0qSTrTN3AHdq9TBmVX69pDCRnBvmRS42Lrh9zNJC_VZH7JYZ-Q/exec', {
        method: 'POST',
        body: new FormData(form),
    })
    .then(response => response.json()) // Confirmar que la solicitud fue exitosa
    .then(data => {
        // Esperar 500ms antes de redirigir a WhatsApp para permitir la carga completa de la página
        setTimeout(() => {
            // Redirigir al enlace de WhatsApp en una nueva pestaña
            window.open(urlWA, "_blank");
        }, 500); 
    })
    .catch(error => {
        console.error('Error al enviar los datos:', error);
        alert("Hubo un error al enviar los datos. Por favor, inténtalo de nuevo más tarde.");
    })
    .finally(() => {
        // Ocultar el mensaje de carga
        loadingMessage.style.display = "none";
    });
}

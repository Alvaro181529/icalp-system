function redirectToWhatsApp(curso) {
    // Número de WhatsApp (formato: código país + número sin +)
    const numeroWhatsApp = "59176771530";
    
    // Mensaje personalizado
    const mensaje = `Hola! Me interesa el seminario ${curso}. ¿Podrían enviarme más información?`;
    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
    
    // Abrir WhatsApp en nueva pestaña
    window.open(urlWhatsApp, '_blank');
}
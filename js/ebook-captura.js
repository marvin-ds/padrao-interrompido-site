(function () {
  const whatsappButton = document.getElementById("whatsapp-ebook");

  if (whatsappButton) {
    const numeroAtendente = "5519999999999";
    const mensagem = encodeURIComponent(
      "Oi, acabei de me cadastrar para receber o ebook gratuito. Pode me enviar por aqui também?"
    );

    whatsappButton.href = `https://wa.me/${numeroAtendente}?text=${mensagem}`;
    whatsappButton.target = "_blank";
    whatsappButton.rel = "noopener noreferrer";
  }
})();

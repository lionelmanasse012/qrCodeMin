document
  .getElementById("qrcode-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch("https://formulaire-api-mardo.onrender.com/api/qrcode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    const qrCodeImage = document.getElementById("qrCodeImage");
    const qrTitle = document.getElementById("qrTitle");

    if (result.qrCodeImage) {
      qrCodeImage.src = result.qrCodeImage;
      qrCodeImage.style.display = "block";
      qrTitle.style.display = "block";
    } else {
      qrCodeImage.style.display = "none";
      qrTitle.style.display = "none";
      alert("Erreur lors de la génération du QR Code");
    }
  });

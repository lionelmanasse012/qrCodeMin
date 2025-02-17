const print = document.getElementById("print");
print.style.display = "none";
const form = document.getElementById("qrcode-form");
const submitButton = document.querySelector("#qrcode-form button[type='submit']");

document
  .getElementById("qrcode-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Désactiver le bouton "Envoyer" et changer son style
    submitButton.disabled = true;
    submitButton.textContent = "Traitement...";
    submitButton.style.backgroundColor = "#cccccc"; // Couleur grise (indique un état désactivé)
    submitButton.style.cursor = "not-allowed"; // Change le curseur pour renforcer l'indication

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
      // Effectuer la requête
      const response = await fetch("http://localhost:3001/api/qrcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      const qrCodeImage = document.getElementById("qrCodeImage");
      const qrTitle = document.getElementById("qrTitle");

      const printImage = () => {
        let image = qrCodeImage;
        let newWindow = window.open("", "_blank");
        newWindow.document.write(
          `<html><head><title>Impression</title></head><body><img src=${image.src}></body></html>`
        );
        newWindow.document.close();
        newWindow.print();
        newWindow.close();
      };

      print.onclick = printImage;

      if (result.qrCodeImage) {
        qrCodeImage.src = result.qrCodeImage;
        qrCodeImage.style.display = "block";
        qrTitle.style.display = "block";
        print.style.display = "inline-block";
      } else {
        qrCodeImage.style.display = "none";
        qrTitle.style.display = "none";
        alert("Erreur lors de la génération du QR Code");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      // Réactiver le bouton "Envoyer", réinitialiser son texte et son style
      submitButton.disabled = false;
      submitButton.textContent = "Envoyer";
      submitButton.style.backgroundColor = ""; // Revenir à la couleur par défaut
      submitButton.style.cursor = ""; // Revenir au curseur par défaut
    }

    form.reset();
  });

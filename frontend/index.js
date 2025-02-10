const print = document.getElementById('print');
print.style.display = "none"

document
  .getElementById("qrcode-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch("http://localhost:3000/api/qrcode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    const qrCodeImage = document.getElementById("qrCodeImage");
    const qrTitle = document.getElementById("qrTitle");

    const printImage = () => {
      
      let image = qrCodeImage;
      console.log(image.src);
      let newWindow = window.open("", "_blank");
      newWindow.document.write(`<html><head><title>Impression</title></head><body><img src=${image.src}></body></html>`);
      newWindow.document.close();
      newWindow.print();
      newWindow.close();
    }

    print.onclick = printImage

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
  });

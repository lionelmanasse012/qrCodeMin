const express = require("express");
const QRCode = require("qrcode");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/qrcode", async (req, res) => {
  try {
    console.log("Données reçues :", req.body); // Vérification

    const { nom, post_nom, prenom, bon, carriere, ministre } = req.body;

    if (!nom || !post_nom || !prenom || !bon || !carriere || !ministre) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const data = `Nom: ${nom}\nPost-nom: ${post_nom}\nPrénom: ${prenom}\nBon: ${bon}\nCarrière: ${carriere}\nMinistre: ${ministre}`;

    console.log("Données encodées :", data); 
    
    const qrCodeImage = await QRCode.toDataURL(data);
    res.json({ qrCodeImage });
  } catch (error) {
    console.error("Erreur QR Code :", error);
    res.status(500).json({ error: "Erreur lors de la génération du QR code" });
  }
});

app.listen(port, () => {
  console.log(`API en ligne sur http://localhost:${port}`);
});

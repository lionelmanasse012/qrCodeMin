import express from "express";
import QRCode from "qrcode";
import cors from "cors";
import pkg from 'pg';

const { Pool } = pkg; // PostgreSQL

const app = express();
const port = process.env.PORT || 3001;

// Configuration de la base de données PostgreSQL avec l'URL fournie par Render
const pool = new Pool({
  connectionString: "postgresql://qrcodedb_8ucn_user:JVanRXMtzrPrqnpGezvLP1IHZnx1AcWD@dpg-cupdo35svqrc73f041vg-a.frankfurt-postgres.render.com/qrcodedb_8ucn",
  ssl: {
    rejectUnauthorized: false, // Désactive la vérification du certificat SSL (important pour Render)
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint pour créer et stocker un QR code
app.post("/api/qrcode", async (req, res) => {
  try {
    const { nom, prenom, bon, carriere, ministre } = req.body;

    // Validation des données reçues
    if (!nom || !prenom || !bon || !carriere || !ministre) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    // Données encodées dans le QR code
    const qrData = `Nom: ${nom}\nPrénom: ${prenom}\nBon: ${bon}\nCarrière: ${carriere}\nMinistre: ${ministre}`;
    const qrCodeSerial = `QR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Génération du QR code en base64
    let qrCodeImage;
    try {
      qrCodeImage = await QRCode.toDataURL(qrData);
    } catch (qrError) {
      console.error("Erreur lors de la génération du QR code:", qrError);
      return res.status(500).json({ error: "Erreur lors de la génération du QR code" });
    }

    // Insertion des données dans la base de données avec `qrCodeSerial` comme clé primaire
    const insertQuery = `
      INSERT INTO qrData (qrCodeSerial, nom, prenom, bon, carriere, ministre, qrCodeData, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING qrCodeSerial;
    `;
    let result;
    try {
      result = await pool.query(insertQuery, [
        qrCodeSerial,
        nom,
        prenom,
        bon,
        carriere,
        ministre,
        qrCodeImage,
        "pending", // Statut initial
      ]);
    } catch (dbError) {
      console.error("Erreur lors de l'insertion dans la base de données:", dbError);
      return res.status(500).json({ error: "Erreur lors de l'insertion dans la base de données" });
    }

    // Réponse avec le numéro de série et l'image générée
    res.json({
      qrCodeSerial: result.rows[0].qrcodeSerial,
      qrCodeImage,
    });
  } catch (error) {
    // Affiche l'erreur complète dans les logs pour faciliter le débogage
    console.error("Erreur lors du traitement de la requête:", error);
    res.status(500).json({ error: `Erreur lors de la création du QR code: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`API en ligne sur http://localhost:${port}`);
});

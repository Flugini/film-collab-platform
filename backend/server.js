const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');  // Benutzer-Routen importieren
const filmRoutes = require('./routes/filmRoutes');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB-Verbindung
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB verbunden"))
  .catch((err) => console.log(err));

// Routen einbinden
app.use('/api/users', userRoutes);  // Diese Zeile stellt sicher, dass /register erreichbar ist
app.use('/api/films', filmRoutes);

// Nach deinen anderen Routen kannst du eine einfache Route für die Token-Überprüfung einfügen:

app.get('/test-token', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Token aus dem Header extrahieren
  if (!token) return res.status(400).json({ message: 'Kein Token übergeben!' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifizierung des Tokens
    res.status(200).json({ message: 'Token gültig!', decoded });
  } catch (err) {
    res.status(401).json({ message: 'Ungültiges Token!', error: err.message });
  }
});


// Beispielroute
app.get('/', (req, res) => {
  res.send('Welcome to ReelConnection!');
});

// Server starten
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server läuft auf PORT ${PORT}`);
});



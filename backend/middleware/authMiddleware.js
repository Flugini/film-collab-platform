const jwt = require('jsonwebtoken');

// Hier wird der JWT_SECRET aus der Umgebung (process.env) geladen
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log("Authorization Header:", authHeader); // ✅ Debug-Info

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error("⚠️ Kein oder falsches Token-Format!");
    return res.status(401).json({ message: 'Kein Token, Zugriff verweigert!' });
  }

  // Token extrahieren (nach "Bearer ")
  const token = authHeader.split(' ')[1];
  console.log("Extrahierter Token:", token); // ✅ Zeigt den extrahierten Token

  try {
    // Hier wird der JWT_SECRET verwendet, der aus der .env-Datei geladen wird
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Token erfolgreich verifiziert:", decoded);

    req.user = decoded; // Speichert die User-Info aus dem Token
    next(); // Geht zur nächsten Middleware/Route
  } catch (error) {
    console.error("❌ Token Fehler:", error.message);
    return res.status(401).json({ message: 'Ungültiges Token!' });
  }
};

module.exports = authMiddleware;

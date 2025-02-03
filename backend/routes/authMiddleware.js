const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Benutzer-Modell importieren

const authMiddleware = (req, res, next) => {
  // Hole das Token aus dem Authorization Header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Überprüfen, ob ein Token übergeben wurde
  if (!token) {
    return res.status(401).json({ message: 'Kein Token, Zugriff verweigert' });
  }

  try {
    // Verifiziere das Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Füge das Benutzerobjekt zum Request hinzu (User-Id und Email aus dem Token)
    req.user = decoded;
    
    // Gehe zur nächsten Route oder Middleware
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Ungültiges Token' });
  }
};

module.exports = authMiddleware;

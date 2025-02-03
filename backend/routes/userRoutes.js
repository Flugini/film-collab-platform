const express = require('express');
const {
  registerUser, 
  loginUser,
  getUserProfile,
  updateUserProfile,
  matchUsers,
  getAllUsers
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Hier der richtige Import
const router = express.Router();

// Öffentliche Routen
router.post('/register', registerUser);     // Registrierung
router.post('/login', loginUser);           // Login

// Geschützte Routen (werden durch authMiddleware gesichert)
router.get('/user/:email', authMiddleware, getUserProfile);      // Benutzerprofil abrufen
router.put('/user/:email', authMiddleware, updateUserProfile);   // Benutzerprofil aktualisieren
router.get('/match', authMiddleware, matchUsers);                // Benutzer-Matching

//Neue Route zum Abrufen aller Benutzer
router.get('/', authMiddleware, getAllUsers);

module.exports = router;

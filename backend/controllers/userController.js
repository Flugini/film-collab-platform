const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'deinGeheimesJWTSecret';

// Registrierung
exports.registerUser = async (req, res) => {
  const { name, email, password, role, bio, skills, location } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Fehlende erforderliche Felder' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'Benutzer existiert bereits!' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role,
    bio,
    skills: Array.isArray(skills) ? skills : skills.split(','),
    location
  });

  try {
    await newUser.save();
    res.status(201).json({ message: 'Benutzer erstellt!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fehler beim Erstellen des Benutzers' });
  }
};

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Benutzer nicht gefunden!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Ungültige Anmeldedaten!' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({ 
      message: 'Erfolgreich angemeldet', 
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fehler beim Login' });
  }
};

// Benutzerprofil abrufen
exports.getUserProfile = async (req, res) => {
  const { userId } = req.user;  // Benutzer-ID aus dem Token
  try {
    const user = await User.findById(userId);  // Suche den Benutzer über die ID, nicht die E-Mail
    if (!user) return res.status(404).json({ message: 'Benutzer nicht gefunden!' });

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fehler beim Abrufen des Benutzers' });
  }
};

// Benutzerprofil aktualisieren
exports.updateUserProfile = async (req, res) => {
  const { userId } = req.user;  // Benutzer-ID aus dem Token
  const { name, bio, skills, location } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Benutzer nicht gefunden!' });

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (skills) user.skills = Array.isArray(skills) ? skills : skills.split(',');
    if (location) user.location = location;

    const updatedUser = await user.save();
    res.status(200).json({ message: 'Benutzer aktualisiert!', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fehler beim Aktualisieren des Benutzers' });
  }
};

//Alle Benutzer abrufen
exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find();  // Alle Benutzer abrufen
      res.status(200).json(users); // Benutzer als Antwort senden
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Fehler beim Abrufen der Benutzer' });
    }
  };
  

// Benutzer-Matching
exports.matchUsers = async (req, res) => {
  const { skills, role, location } = req.query;
  const queryConditions = {};

  if (role) queryConditions.role = role;
  if (location) queryConditions.location = location;
  if (skills) queryConditions.skills = { $in: skills.split(',') };

  try {
    const matchedUsers = await User.find(queryConditions);

    if (matchedUsers.length === 0) {
      return res.status(404).json({ message: 'Keine passenden Benutzer gefunden!' });
    }

    res.status(200).json(matchedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fehler beim Matching der Benutzer' });
  }
};

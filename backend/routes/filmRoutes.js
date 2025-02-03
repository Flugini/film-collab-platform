const express = require('express');
const Film = require('../models/Film');  // Film-Modell importieren
const router = express.Router();

// Route zum Erstellen eines neuen Films
router.post('/film', async (req, res) => {
  const { title, description, genre, releaseYear } = req.body;

  const newFilm = new Film({ title, description, genre, releaseYear });

  try {
    await newFilm.save();  // Speichern des Films in der Datenbank
    res.status(201).json({ message: 'Film erstellt!' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Erstellen des Films' });
  }
});

// Route zum Abrufen eines Films nach Titel
router.get('/film/:title', async (req, res) => {
  const { title } = req.params;

  try {
    const film = await Film.findOne({ title });
    if (!film) return res.status(404).json({ message: 'Film nicht gefunden!' });
    res.status(200).json(film);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen des Films' });
  }
});

router.get('/', async (req, res) => {
    try {
      const films = await Film.find();
      res.status(200).json(films);
    } catch (error) {
      res.status(500).json({ message: 'Fehler beim Abrufen der Filme' });
    }
});

// Route zum Aktualisieren eines Films
router.put('/film/:title', async (req, res) => {
    const { title } = req.params;
    const { description, genre, releaseYear } = req.body;
  
    try {
      const film = await Film.findOne({ title });
      if (!film) return res.status(404).json({ message: 'Film nicht gefunden!' });
  
      // Eigenschaften aktualisieren
      if (description) film.description = description;
      if (genre) film.genre = genre;
      if (releaseYear) film.releaseYear = releaseYear;
  
      const updatedFilm = await film.save();
      res.status(200).json({ message: 'Film aktualisiert!', updatedFilm });
    } catch (error) {
      res.status(500).json({ message: 'Fehler beim Aktualisieren des Films' });
    }
  });

  // Route zum Löschen eines Films
router.delete('/film/:title', async (req, res) => {
    const { title } = req.params;
  
    try {
      const film = await Film.findOneAndDelete({ title });
      if (!film) return res.status(404).json({ message: 'Film nicht gefunden!' });
  
      res.status(200).json({ message: 'Film erfolgreich gelöscht!' });
    } catch (error) {
      res.status(500).json({ message: 'Fehler beim Löschen des Films' });
    }
  });
  
  

module.exports = router;

const mongoose = require('mongoose');

//Film-Schema
const FilmSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    genre: {type: String, required: true},
    releaseYear: {type: Number, required: true},
});

//Film-Modell
const Film = mongoose.model('Film', FilmSchema);

module.exports = Film;
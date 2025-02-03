const mongoose = require('mongoose');

//Benutzer-Schema 
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['Regisseur', 'Regisseurin', 'Drehbuchautor', 'Drehbuchautorin', 'Kameramann', 'Kamerafrau', 'Produzent', 'Produzentin'], required: true},
    bio: {type: String},
    skills: {type: [String]},
    location: {type: String}
});

//Benutzer-Modell
const User = mongoose.model('User', userSchema);

module.exports = User;
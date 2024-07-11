const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
    text: { type: String, required: true },
    imageUri: { type: String, required: true }
});

module.exports = mongoose.model('Gallery', GallerySchema);
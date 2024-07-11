const { default: mongoose } = require("mongoose");

const FlashcardSchema = new mongoose.Schema({
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sourceLang: { type: String, required: true },
    targetLang: { type: String, required: true },
    sourceText: { type: String, required: true },
    targetText: { type: String, required: true },
    sourceAudio: { type: String }, // URL to audio file
    targetAudio: { type: String }, // URL to audio file
    illustration: { type: String }, // URL to image file
    isOfficial: { type: Boolean, default: false }
  });

  const flashCard = mongoose.model('flash_cards',FlashcardSchema)

  module.exports=flashCard
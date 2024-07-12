const mongoose = require('mongoose');

const FlashcardSetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flashcards: [{
    flashcard: { type: mongoose.Schema.Types.ObjectId, ref: 'flash_cards' },
    order: { type: Number, required: true },
  }],
  createdAt: { type: Date, default: Date.now },

});
FlashcardSetSchema.methods.addFlashcard = function(flashcardId) {
  const maxOrder = this.flashcards.length > 0 
    ? Math.max(...this.flashcards.map(f => f.order))
    : 0;
  
  this.flashcards.push({
    flashcard: flashcardId,
    order: maxOrder + 1
  });
};

// Method to update the order of flashcards
FlashcardSetSchema.methods.updateOrder = function(newOrder) {
  // newOrder should be an array of { flashcardId, order }
  newOrder.forEach(({ flashcardId, order }) => {
    const flashcard = this.flashcards.find(f => f.flashcard.toString() === flashcardId);
    if (flashcard) {
      flashcard.order = order;
    }
  });

  // Sort the flashcards array based on the new order
  this.flashcards.sort((a, b) => a.order - b.order);
};

const FlashCardSet=mongoose.model('FlashcardSet', FlashcardSetSchema);
module.exports = FlashCardSet;
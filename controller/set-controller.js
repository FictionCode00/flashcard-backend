const sendResponse = require("../common/response");
const { CREATE_STATUS_CODE, SUCCESS_STATUS_CODE, NOT_FOUND_STATUS_CODE } = require("../common/statusCodes");
const flashCard = require("../models/cards");
const FlashCardSet = require("../models/sets");

exports.AddSet = async (req, res, next) => {

    try {
        const { name } = req.body;
        const set = new FlashCardSet({ name, user: req.user.id })
        const data = await set.save()
        sendResponse(res, data, CREATE_STATUS_CODE)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.getUserSets = async (req, res, next) => {
    try {

        const sets = await FlashCardSet.find({ user: req.user.id })
        sendResponse(res, sets, SUCCESS_STATUS_CODE)
    } catch (error) {
        console.log(error)
        next(error)

    }
}

exports.addCardToSet = async (req, res, next) => {
    try {
        const { id } = req.params
        const { cardId } = req.body;
        const set = await FlashCardSet.findById(id);

        if (!set) {
            return sendResponse(res, { message: 'Flashcard set not found' }, NOT_FOUND_STATUS_CODE);
        }

        const flashcard = await flashCard.findById(cardId);
        if (!flashcard) {
            return sendResponse(res, { message: 'Flashcard not found' }, NOT_FOUND_STATUS_CODE);
        }

        // Check if the flashcard is already in the set
        const existingCard = set.flashcards.find(card => card.flashcard.toString() === cardId);
        if (existingCard) {
            return sendResponse(res, { message: 'Flashcard already exists in the set' }, NOT_FOUND_STATUS_CODE)
        }

        set.addFlashcard(cardId);
        await set.save();
        sendResponse(res, { message: "successfully added." }, SUCCESS_STATUS_CODE)

    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.updateFlashcardOrder = async (req, res) => {
    try {
        const { setId } = req.params;
        const { newOrder } = req.body;  // Array of { flashcardId, order }

        const set = await FlashCardSet.findById(setId);
        if (!set) {
            return sendResponse(res, { message: 'Flashcard set not found' }, NOT_FOUND_STATUS_CODE);
        }

        set.updateOrder(newOrder);
        await set.save();

        sendResponse(res, { message: 'Flashcard order updated successfully', set }, SUCCESS_STATUS_CODE);
    } catch (error) {
        console.log(error)
        next(error)
    }
};


exports.getUserSetsCards = async (req, res, next) => {
    const { id } = req.params
    try {
        const sets = await FlashCardSet.find({ user: req.user.id,_id:id }).populate('flashcards.flashcard')
        sendResponse(res, sets[0], SUCCESS_STATUS_CODE)
    } catch (error) {
        console.log(error)
        next(error)

    }
}
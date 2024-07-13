const sendResponse = require("../common/response");
const { SUCCESS_STATUS_CODE } = require("../common/statusCodes");
const flashCard = require("../models/cards");
const FlashCardSet = require("../models/sets");

exports.addFlashCard = async (req, res, next) => {
    try {
        const { sourceLang, targetLang, sourceText, targetText,setId } = req.body;
       
        const set = await FlashCardSet.findById(setId);
        const newFlashcard = new flashCard({
            createdBy: req.user.id, // Assuming auth middleware adds user to req
            sourceLang,
            targetLang,
            sourceText,
            targetText,
            sourceAudio: req.files['sourceAudio'] ? req.files['sourceAudio'][0].location : null,
            targetAudio: req.files['targetAudio'] ? req.files['targetAudio'][0].location : null,
            illustration: req.files['image'] ? req.files['image'][0].location : null,
        });

        const savedFlashcard = await newFlashcard.save();
        set.addFlashcard(savedFlashcard._id)
        await set.save();
        res.status(201).json(savedFlashcard);
    } catch (error) {
        console.log(error)
        next(error);
    }
};

exports.getCards= async(req,res,next)=>{
    try {
        const cards = await flashCard.find({ createdBy: req.user.id });
        sendResponse(res,cards,SUCCESS_STATUS_CODE)
    } catch (error) {
        console.log(error)
        next(error)
    }
}
exports.getsavedCards= async(req,res,next)=>{
    try {
        const cards = await flashCard.find();
        sendResponse(res,cards,SUCCESS_STATUS_CODE)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.getCard= async(req,res,next)=>{
    try {
        const { id } = req.params

       const cards = await flashCard.findById(id);

       const next = await flashCard.findOne( { _id: { $gt: id } } )
       const prev = await flashCard.findOne( { _id: { $lt: id } } );
       let prevId = null;
       if(prev){
            prevId = prev._id
       }
       let nextId = null;
       if(next){
            nextId = next._id
       }
       console.log(next);
       console.log('hello');
       console.log(nextId);

    

       let data = {'cards':cards,'prev':prevId,'next':nextId}
        
        sendResponse(res,data,SUCCESS_STATUS_CODE)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const sendResponse = require("../common/response");
const { SUCCESS_STATUS_CODE } = require("../common/statusCodes");
const flashCard = require("../models/cards");
const FlashCardSet = require("../models/sets");
const UserLimit = require("../models/userlimit");
const User = require("../models/users");


function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}


exports.addFlashCard = async (req, res, next) => {
    try {
        const { sourceLang, targetLang, sourceText, targetText,setId,isprevimg,issourceAudio,istargetAudio } = req.body;
        let settId = setId;
        if(settId == 'new'){
             const newFlashCardSet = new FlashCardSet({
            // createdBy: req.user.id, // Assuming auth middleware adds user to req
            name:sourceLang+' - '+targetLang+' 1-100',
            user:req.user.id,
            
        }); 

        const saveddFlashcard = await newFlashCardSet.save();
         
            settId =saveddFlashcard._id
        }
        const set = await FlashCardSet.findById(settId);
        let imgval = req.files['image'] ? req.files['image'][0].location : null;
        if(isprevimg != ''){
            imgval = isprevimg;
        }

        let sourceAudioval = req.files['sourceAudio'] ? req.files['sourceAudio'][0].location : null;
        if(issourceAudio != ''){
            sourceAudioval = issourceAudio;
        }


        let targetAudioval = req.files['targetAudio'] ? req.files['targetAudio'][0].location : null;
        if(istargetAudio != ''){
            targetAudioval = istargetAudio;
        }

        const newFlashcard = new flashCard({
            // createdBy: req.user.id, // Assuming auth middleware adds user to req
            sourceLang,
            targetLang,
            sourceText,
            targetText,
            sourceAudio: sourceAudioval,
            targetAudio: targetAudioval,
            illustration: imgval,
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
       
        const { cardid, istype } = req.body;

    


       const cards = await flashCard.findById(cardid);

       if(istype == 1){


        const checkPreventry = await UserLimit.find({userId: req.user.id,cardId : cardid}).count();

        if(checkPreventry == 0){
             try {
               console.log(istype);
        const set = new UserLimit({ userId: req.user.id,cardId : cardid  })
                const dasta = await set.save()
               
            } catch (error) {
                console.log(error)
                next(error)
            }
        }
    
       }

       const checkPreventry = await UserLimit.find({userId: req.user.id}).count();
       let isAllowed = 1;

       let user = await User.findById(req.user.id).select('cardlimit');
       console.log(user);
       if(user){
        if(checkPreventry > user.cardlimit){

            isAllowed = 0;
            
        }
       }

      // let data = {'cards':cards,'isAllowed':isAllowed+' - '+checkPreventry+' - '+user.cardlimit}

      let checkSet =  await FlashCardSet.findOne({ 
   "flashcards.flashcard": cards._id
}); 
     
      let data = {'cards':cards,'isAllowed':isAllowed,'setid':checkSet._id}
       
        
        sendResponse(res,data,SUCCESS_STATUS_CODE)
    } catch (error) {
        console.log(error)
        next(error)
    }
}


exports.getFilterCards=async(req,res,next)=>{
    const {sourceLang,targetLang}=req.body
    try {
        const cards = await flashCard.find({
            sourceLang: { $regex: sourceLang, $options: 'i' },
            targetLang: { $regex: targetLang, $options: 'i' }
          })
        sendResponse(res,cards,SUCCESS_STATUS_CODE)
    } catch (error) {
        console.log(error)
        next(error)
    }
}
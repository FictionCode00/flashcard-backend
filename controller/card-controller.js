const sendResponse = require("../common/response");
const { SUCCESS_STATUS_CODE,NOT_FOUND_STATUS_CODE } = require("../common/statusCodes");
const flashCard = require("../models/cards");
const FlashCardSet = require("../models/sets");
const UserLimit = require("../models/userlimit");
const User = require("../models/users");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path



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
            illustration: imgval
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


exports.editFlashCard = async (req, res, next) => {
    try {
        const { cardId,sourceLang, targetLang, sourceText, targetText,setId,isprevimg,issourceAudio,istargetAudio } = req.body;
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

         let flscard = await flashCard.findById(cardId);

        if (!flscard) {
            return sendResponse(res, { message: 'Flashcard not found' }, NOT_FOUND_STATUS_CODE);
        }

         flscard.sourceLang = sourceLang;
         flscard.targetLang = targetLang;
         flscard.sourceText = sourceText;
         flscard.targetText = targetText;
         flscard.sourceAudio = sourceAudioval;
         flscard.targetAudio = targetAudioval;
         flscard.illustration = imgval;
         flscard.save();
       
       

        if (!set) {
            return sendResponse(res, { message: 'Flashcard set not found' }, NOT_FOUND_STATUS_CODE);
        }

         

        // Check if the flashcard is already in the set
        const existingCard = set.flashcards.find(card => card.flashcard.toString() === cardId);
        if (existingCard) {
           
        }else{
            set.addFlashcard(cardId);
            await set.save();
        }

        

        res.status(201).json(flscard);
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

    


       let cards = await flashCard.findById(cardid);

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
 var http = require('http');
var url = require('url') ;
      var hostname = req.headers.host; // hostname = 'localhost:8080'

      const sourcefileExt = get_url_extension(cards.sourceAudio);
            const targetfileExt = get_url_extension(cards.targetAudio);

             if(sourcefileExt == 'ogg'){
                var ffmpeg = require('fluent-ffmpeg')
                  , fs = require('fs')
                  ffmpeg.setFfmpegPath(ffmpegPath)
                 var outStream = fs.createWriteStream('./saudio/soutput.mp3');

                 ffmpeg()
                  .input(cards.sourceAudio)
                  .audioQuality(96)
                  .toFormat("mp3")
                  .on('error', error => console.log(`Encoding Error: ${error.message}`))
                  .on('exit', () => console.log('Audio recorder exited'))
                  .on('close', () => console.log('Audio recorder closed'))
                  .on('end', () => console.log('Audio Transcoding succeeded !'))
                  .pipe(outStream, { end: true });
                  cards.sourceAudio = 'https://' + hostname+'/api/saudio/soutput.mp3';
             }
              if(targetfileExt == 'ogg'){
                var ffmpeg = require('fluent-ffmpeg')
                  , fs = require('fs')
                  ffmpeg.setFfmpegPath(ffmpegPath)
                 var outStream = fs.createWriteStream('./taudio/toutput.mp3');

                 ffmpeg()
                  .input(cards.targetAudio)
                  .audioQuality(96)
                  .toFormat("mp3")
                  .on('error', error => console.log(`Encoding Error: ${error.message}`))
                  .on('exit', () => console.log('Audio recorder exited'))
                  .on('close', () => console.log('Audio recorder closed'))
                  .on('end', () => console.log('Audio Transcoding succeeded !'))
                  .pipe(outStream, { end: true });
                  cards.targetAudio = 'https://' + hostname+'/api/taudio/toutput.mp3';
             }

      


     
      let data = {'cards':cards,'isAllowed':isAllowed,'setid':checkSet._id}
       
        
        sendResponse(res,data,SUCCESS_STATUS_CODE)
    } catch (error) {
        console.log(error)
        next(error)
    }
}


exports.getFilterCards=async(req,res,next)=>{
    
    var http = require('http');
    var url = require('url') ;
    var hostname = req.headers.host; // hostname = 'localhost:8080'
    const {sourceLang,targetLang}=req.body
    try {
        let cards = await flashCard.find({
            sourceLang: { $regex: sourceLang, $options: 'i' },
            targetLang: { $regex: targetLang, $options: 'i' }
          })

        for (var i = 0; i < cards.length; i++) {

            const sourcefileExt = get_url_extension(cards[i]['sourceAudio']);
            const targetfileExt = get_url_extension(cards[i]['targetAudio']);

            if(sourcefileExt == 'ogg'){
                await processCard(cards[i], i,1,hostname);
            }
            if(targetfileExt == 'ogg'){
                await processCard(cards[i], i,2,hostname);
            }
        }
        sendResponse(res,cards,SUCCESS_STATUS_CODE)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

function processAudio(inputFile, outputFile) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputFile)
      .audioQuality(96)
      .toFormat("mp3")
      .on('error', error => {
        console.error('Encoding Error: ${error.message}');
        reject(error);
      })
      .on('end', () => {
        console.log('Audio Transcoding succeeded !');
        resolve();
      })
      .save(outputFile);
  });
}

async function processCard(card, index,idd,hostname) {
    
    if(idd == 1){
        const outputFile = './taudio/output_${index}.mp3';
        try {
        await processAudio(card.sourceAudio, outputFile);
        card.targetAudio = 'https://${hostname}/api/saudio/output_${index}.mp3';
        } catch (error) {
        console.error('Failed to process audio for card ${index}', error);
        }
    }else{
        const outputFile = './taudio/output_${index}.mp3';
        try {
        await processAudio(card.targetAudio, outputFile);
        card.targetAudio = 'https://${hostname}/api/taudio/output_${index}.mp3';
        } catch (error) {
        console.error('Failed to process audio for card ${index}:', error);
        }
    }
  
}



function get_url_extension( url ) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
}


exports.DeleteCard= async(req,res,next)=>{
    const {cardid,setid}=req.body


    try {
       
      
       await flashCard.findByIdAndDelete(cardid);

       const set = await FlashCardSet.findById(setid);
        // Check if the flashcard is already in the set
        if (!set) {
            return sendResponse(res, { message: 'Flashcard set not found' }, NOT_FOUND_STATUS_CODE);
        }
        // Check if the flashcard is already in the set
       await FlashCardSet.findOneAndUpdate(
        { _id: setid },
        { $pull: { flashcards: { flashcard: cardid } } },
        { safe: true, multi: false }
      );
        
        sendResponse(res,set,SUCCESS_STATUS_CODE)

    } catch (error) {
        console.log(error)
        next(error)
    }
}
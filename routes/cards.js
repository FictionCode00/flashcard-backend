var express = require('express');
const { addFlashCard, getCards,getsavedCards,getCard, getFilterCards,editFlashCard,DeleteCard } = require('../controller/card-controller');
const { authenticateToken } = require('../middlewares/Authentication');
const upload = require('../config/bucket-config');

var router = express.Router();

router.post('/add-card',authenticateToken,upload.fields([
    { name: 'sourceAudio', maxCount: 1 },
    { name: 'targetAudio', maxCount: 1 },
    {name:"image",maxCount:1}
  ]) ,addFlashCard)

router.post('/edit-card',authenticateToken,upload.fields([
    { name: 'sourceAudio', maxCount: 1 },
    { name: 'targetAudio', maxCount: 1 },
    {name:"image",maxCount:1}
  ]) ,editFlashCard)

  router.get('/',getCards)
  router.get('/get-all-cards',getsavedCards)
  router.post('/get-filtered-card',getFilterCards)
  router.post('/get-card',authenticateToken,upload.fields([
    { name: 'sourceAudio', maxCount: 1 },
    { name: 'targetAudio', maxCount: 1 },
    {name:"image",maxCount:1}
  ]) ,getCard)

  router.post('/delete-card' ,authenticateToken,DeleteCard)


module.exports = router;
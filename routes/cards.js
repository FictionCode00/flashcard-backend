var express = require('express');
const { addFlashCard, getCards } = require('../controller/card-controller');
const { authenticateToken } = require('../middlewares/Authentication');
const upload = require('../config/bucket-config');

var router = express.Router();

router.post('/add-card',authenticateToken,upload.fields([
    { name: 'sourceAudio', maxCount: 1 },
    { name: 'targetAudio', maxCount: 1 },
    {name:"image",maxCount:1}
  ]) ,addFlashCard)

  router.get('/',authenticateToken,getCards)

module.exports = router;
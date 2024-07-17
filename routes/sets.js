var express = require('express');

const { authenticateToken } = require('../middlewares/Authentication');
const upload = require('../config/bucket-config');
const { AddSet, getUserSets, addCardToSet,getUserSetsCards,updateFlashcardOrder } = require('../controller/set-controller');

var router = express.Router();

router.post('/add' ,authenticateToken,AddSet)
router.get('/' ,authenticateToken,getUserSets)
router.post('/card/:id' ,authenticateToken,addCardToSet)
router.get('/view-cards/:id' ,authenticateToken,getUserSetsCards)
router.put('/update-card-order/:id',authenticateToken,updateFlashcardOrder)


module.exports = router;
var express = require('express');

const { authenticateToken } = require('../middlewares/Authentication');
const upload = require('../config/bucket-config');
const { AddSet, getUserSets, addCardToSet,getUserSetsCards } = require('../controller/set-controller');

var router = express.Router();

router.post('/add' ,AddSet)
router.get('/' ,getUserSets)
router.post('/card/:id' ,addCardToSet)
router.get('/view-cards/:id' ,getUserSetsCards)


module.exports = router;
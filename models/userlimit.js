const mongoose = require('mongoose');

const UserCardLimitSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    cardId: { type: String, required: true }
});

module.exports = mongoose.model('usercardlimits', UserCardLimitSchema);
const mongoose = require('mongoose');

const viewSchema = new mongoose.Schema({
    count: { type: Number, default: 0 },
});

const View = mongoose.model('views', viewSchema);

module.exports = { View };
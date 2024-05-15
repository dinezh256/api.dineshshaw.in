const mongoose = require('mongoose');

const viewSchema = new mongoose.Schema({
    blogId: { type: Number, required: true },
    count: { type: Number, default: 0 },
});

const View = mongoose.model('views', viewSchema);

module.exports = { View };
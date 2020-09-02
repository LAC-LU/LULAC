const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {type: String, required: true},
    date: {type: Date, required: true},
    place: {type: String},
    time: {type: String},
    description: {type: String, required: true},
    img:{data: Buffer,
        contentType: String
    },
    winner: {type: String, default: "not announced"},
    runner: {type: String, default: "not announced"}
});

const eventModel = new mongoose.model("Event" , eventSchema);

module.exports = eventModel;
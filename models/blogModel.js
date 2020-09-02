const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {type: String, required: true},
    date: {type: Date, required: true},
    description: {type: String,required: true},
    img:{data: Buffer,
        contentType: String
    }
});

const blogModel = new mongoose.model("Blog" , blogSchema);

module.exports = blogModel;
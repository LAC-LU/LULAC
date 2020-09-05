const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {type: String, required: true},
    date: {type: Date, required: true},
    caption: {type: String, required: true},
    description: {type: String,required: true},
    img:{data: Buffer,
        contentType: String
    },
    authorName:{type: String ,default:""},
    authorImg:{
        data: Buffer,
        contentType: String
    },
    authorDetail:{type: String,default:""}
});

const blogModel = new mongoose.model("Blog" , blogSchema);

module.exports = blogModel;

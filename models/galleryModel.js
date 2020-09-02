const mongoose = require('mongoose');

 const gallerySchema = new mongoose.Schema({
     description: {type: String, required: true},
     img:{data: Buffer,
    contentType: String}
 });

 const galleryModel = new mongoose.model("Gallery", gallerySchema);

 module.exports = galleryModel;
const mongoose = require('mongoose');

 const teamSchema = new mongoose.Schema({
     name: {type: String, required: true},
     category: {type: String, required: true},
     img:{data: Buffer,
    contentType: String}
 });

 const teamModel = new mongoose.model("Team", teamSchema);

 module.exports = teamModel;
const mongoose = require('mongoose');

 const reportSchema = new mongoose.Schema({
     title: { type: String },
     pdf:{ data: Buffer,
    contentType: String }
 });

 const reportModel = mongoose.model("report", reportSchema);

 module.exports = reportModel;
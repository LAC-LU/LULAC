const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.USERNAME,
        pass: process.env.PASSWORD
    }
});

module.exports = transport;

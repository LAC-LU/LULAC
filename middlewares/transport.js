const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAILID,
        pass: process.env.EMAILPASSWORD
    }
});

module.exports = transport;

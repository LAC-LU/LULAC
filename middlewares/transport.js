require('dotenv').config()
const nodemailer = require("nodemailer");
const { MAILID , MAILPASSWORD } = require("../config");

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'lucknowlegalaid@gmail.com',
        pass: 'Lulac123'
    }
});

module.exports = transport;
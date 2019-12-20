const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const { email } = require('../config.json');

async function sendEmail({ to, subject, body }) {
  const senderOptions = email;

  const template = ejs.compile(fs.readFileSync(path.resolve(__dirname, 'mail.ejs'), 'utf8'));
  const html = template({ title: body });
  const mailOptions = {
    from: `${senderOptions.name} <${senderOptions.auth.user}>`, // sender address
    to, // list of receivers
    subject: subject || 'silencew.cn 邮件', // Subject line
    html, // plain text body
  };
  return nodemailer.createTransport(senderOptions).sendMail(mailOptions);
}

module.exports = {
  sendEmail,
};

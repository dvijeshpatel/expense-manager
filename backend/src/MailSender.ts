import nodemailer from 'nodemailer';

let MailSender:  nodemailer.Transporter | undefined;

function createMailSender(): nodemailer.Transporter {
    if (MailSender) {
        return MailSender;
    }
    MailSender = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: process.env.ADMIN_MAIL,
            clientId: process.env.ADMIN_MAIL_CLIENTID,
            clientSecret: process.env.ADMIN_MAIL_CLIENTSECRET,  
            refreshToken: process.env.ADMIN_MAIL_REFRESHTOKEN,
        }
    });
    return MailSender;
}

export default createMailSender();
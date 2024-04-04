const nodemailer = require('nodemailer');
 

const sendEmail = (emailSentTo, OTP) => {
    
    var transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",  
        secureConnection: false,  
        port: 587,  
        tls: {
        ciphers:'SSLv3'
        },
        auth: {
            user: 'connect-opia-no-reply@outlook.com',
            pass: 'D146008028'
        }
    });

    var mailOptions = {
        from: 'connect-opia-no-reply@outlook.com',  
        to: emailSentTo,  
        subject: 'Email Verification',  
        text: 'Hello world ',  
        html: `
          <p>Hello,</p>
          <p>Thank you for signing up !</p>
          <p>Bellow, is the OPT to verify your account:</p>
          <span><b>${OTP}</b><span>
          <p>If you didn't sign up, please ignore this email.</p>
          <p>Best regards,<br>Connectopia Team</p>
        `
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}


module.exports = sendEmail;
//Requerimos el paquete
var nodemailer = require('nodemailer');

//Creamos el objeto de transporte

function sendEmail(correo, token) {
  console.log("Entre ++++++++++");
  var transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
     user: 'jdsc970824@gmail.com',
     pass: 'jose97082423889'
   }
  });


  var mailOptions = {
   from: 'jdsc970824@gmail.com',
   to: correo,
   subject: 'validación con token',
   text: 'Token: '+token
  };

  transporter.sendMail(mailOptions, function(error, info){
   if (error) {
     console.log(error);
   } else {
     //console.log('Email enviado: ' + info.response);
     return info.response;
   }
  });
}

module.exports = sendEmail

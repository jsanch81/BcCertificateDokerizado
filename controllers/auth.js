'use strict'

const mongoose = require('mongoose');
const emailctrl = require('./mailsender.js');
const User = require('../models/user.js');
const service = require('../services/index.js');
var nodemailer = require('nodemailer');
const moment = require('moment');

/**
 * Funcion singUp, crea el usuario en la base de datos y envia el correo con el token
 * @param req, el request que contiene el email del usuario
 * @param res, el response del req
 * @return renderiza la vista
 */
function singUp(req,res) {
  //Crea al usuario en la bade de datos
  const user = new User({
    email: req.body.email,
    displayName: req.body.displayName,
    password: req.body.password,
    tokenLimitDate: 0
  });

  user.save(function (err) {
    if(err) res.status(500).send({message: `error al crear el usuario: ${err}`});

    var transporter2 = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: 'blocklifebc@gmail.com',
       pass: 'bl0ckl1f3'
     }
    });

    var mailOptions = {
     from: 'blocklifebc@gmail.com',
     to: req.body.email,
     subject: 'VALIDACIÓN CON TOKEN BLOCKLIFE',
     html: '<img src="cid:unique@kreata.ee" width="80px" height="80px"/>\n <h3 style="color:black;"> Acontinuación encontrará el token que le permitirá crear matriculas, actas de grados y demás información,\n Token: </h3><h2 style="color:red;">'+service.createToken(user)+'</h2>',
     attachments: [{
        filename: 'logo.jpg',
        path: __dirname + '/logo.jpg',
        cid: 'unique@kreata.ee' //same cid value as in the html img src
     }]
    };
    
    transporter2.sendMail(mailOptions, function(error, info){
      
     if (error) {
       console.log("Llegue hasta aca x4");
       console.log(error);
     } else {
       console.log('Email enviado: ' + info.response);
       //return info.response;
     }
    });
    req.session.user = user.email;

    return res.status(200).render('token');
  });
}

/**
 * Funcion singIn, verifica que el usuario existe y comprueba que el token no haya expirado, si es asi envia un correo 
 * recordanto que ya posee un token, de lo contrario envia un token nuevo
 * @param req, el request que contiene el email del usuario
 * @param res, el response del req
 * @return renderiza la vista
 */
function singIn(req,res) {
  console.log("Entre -------------------------------------------");
  User.find({email: req.body.email},function(err, user) {
    if (err) {
      return res.status(500).send({message: err});
    }
    if (user.length == 0) {
      return res.status(404).render('login',{errorMessage:"El usuario no existe"});
    }
    req.user = user;

    console.log(user);
    //var a = emailctrl.sendEmail(user.email, service.createToken(user));
    //console.log(a);
    var today = moment().unix();
    console.log(today);

    //console.log(user[0].tokenLimitDate);
    if(today <= user[0].tokenLimitDate){
      console.log("Entre");
      var transporter = nodemailer.createTransport({
       service: 'gmail',
       auth: {
         user: 'blocklifebc@gmail.com',
         pass: 'bl0ckl1f3'
       }
      });


      var mailOptions = {
       from: 'blocklifebc@gmail.com',
       to: user[0].email,
       subject: 'VALIDACIÓN CON TOKEN BLOCKLIFE',
       html: '<img src="cid:unique@kreata.ee" width="80px" height="80px"/>\n <h3 style="color:black;"> Actualmente ya posee un token válido, por favor verifica correos anteriores.</h3>',
       attachments: [{
          filename: 'logo.jpg',
          path: __dirname + '/logo.jpg',
          cid: 'unique@kreata.ee' //same cid value as in the html img src
      }]
      };

      transporter.sendMail(mailOptions, function(error, info){
       if (error) {
         console.log(error);
       } else {
         console.log('Email enviado: ' + info.response);
         //return info.response;
       }
      });

    }else{
      var transporter = nodemailer.createTransport({
       service: 'gmail',
       auth: {
         user: 'blocklifebc@gmail.com',
         pass: 'bl0ckl1f3'
       }
      });


      var mailOptions = {
       from: 'blocklifebc@gmail.com',
       to: user[0].email,
       subject: 'VALIDACIÓN CON TOKEN BLOCKLIFE',
       html: '<img src="cid:unique@kreata.ee" width="80px" height="80px"/>\n <h3 style="color:black;"> Acontinuación encontrará el token que le permitirá crear matriculas, actas de grados y demás información,\n Token: </h3><h2 style="color:red;">'+service.createToken(user[0])+'</h2>',
       attachments: [{
          filename: 'logo.jpg',
          path: __dirname + '/logo.jpg',
          cid: 'unique@kreata.ee' //same cid value as in the html img src
      }]
      };

      transporter.sendMail(mailOptions, function(error, info){
       if (error) {
         console.log(error);
       } else {
         console.log('Email enviado: ' + info.response);
         //return info.response;
       }
      });
    }
    req.session.user = user[0].email;


    res.status(200).render('token');
    
  });

}

module.exports = {
  singUp,
  singIn
}

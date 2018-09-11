'use strict'

const config = require('../config.js');
const service = require('../services/index.js');
function isAuth(req, res, next) {
  //console.log(req.session);
  if(req.session.token){
    req.headers.authorization = "Bearer "+req.session.token;
  }
  if (!req.headers.authorization){
    return res.status(403).render('login',{errorMessage:""});
    //return res.status(403).send({message: 'No tienes autorización'});
  }

  var token = req.headers.authorization.split(" ")[1];
  console.log('------------------------');
  console.log(token);
  var emailUser = req.session.user;
  service.decodeToken(token,emailUser).then(function(response) {
    req.session.logged = true;
    req.user = response;
    next();
  }).catch(function(response) {
    res.render(response,{errorMessage:"Token invalido"});
  });


}

module.exports = isAuth

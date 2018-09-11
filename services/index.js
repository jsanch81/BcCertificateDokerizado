'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config.js');
const mongoose = require('mongoose');
const User = require('../models/user.js');



function createToken(user) {
  console.log("***********************");
  console.log(user);
  const payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix()
  }
  console.log(payload.sub);
User.update({_id: user._id},{$set:{tokenLimitDate: payload.exp}}, function(err) {
  console.log("error: "+err);
});
  return jwt.encode(payload,config.SECRET_TOKEN);
}

function decodeToken(token,emailUser) {
  const decode = new Promise(function(resolve, reject) {
    try {
      const payload = jwt.decode(token,config.SECRET_TOKEN);

      console.log(emailUser);
      console.log(payload.sub);
      User.find({_id:payload.sub},function(err,user) {
        console.log(err,user.length);
        if(payload.exp <= moment().unix()) {
          reject('login');
        }else if(user.length == 0 || emailUser !== user[0].email){
           console.log("Entre aca es no valido");
           reject('login');
         }else{
            resolve(payload.sub);
         }
      });



    } catch (err) {
      reject('login');
    }
  });
  console.log("......................");
  console.log(decode);
  return decode;
}

module.exports = {
  createToken,
  decodeToken
}

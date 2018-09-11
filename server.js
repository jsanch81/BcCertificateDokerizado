#!/usr/bin/env node
const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
const Web3 = require('web3');
const truffle_connect = require('./connection/app.js');
const auth = require('./middlewares/auth.js');
const user = require('./controllers/auth.js');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressLayouts = require('express-ejs-layouts');
const notifier = require('node-notifier');
const path = require('path');
var qs = require("querystring");
var http = require("http");
var session = require('express-session')

mongoose.connect('mongodb://mongo:27017/blocklife');
var db = mongoose.connection;


var web3 = new Web3(
    new Web3.providers.HttpProvider('https://rinkeby.infura.io/hgffnOxaTu7Ydsu5VlTg')  //hgffnOxaTu7Ydsu5VlTg
);

var creator = '0x8C3D5f3c20eC4529aa5664342B1564101C31d765';
var key = '8ce30e4aee45067f4d838794c9444292fc891a8d0e34077265806137554d16cc';

var sess = {
  secret: 'keyboard cat',
  cookie: {}
}

app.use(session(sess));

/*
var rawTx = {
    nonce: web3.utils.toHex(web3.eth.getTransactionCount(address)),
    gasLimit: web3.utils.toHex(800000),
    gasPrice: web3.utils.toHex(20000000000),
    data: '0x' + bytecode + '0000000000000000000000000000000000000000000000000000000000000005'
};
*/


//se cambia el motor de vistas por ejs
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Para hacer el layout
app.use(expressLayouts);
// parse application/json
app.use(bodyParser.json());

notifier.on('click', function(notifierObject, options) {
  var options = {
    "method": "POST",
    "hostname": "localhost",
    "port": "3000",
    "path": "/getInfo",
    "headers": {
      "content-type": "application/x-www-form-urlencoded",
      "cache-control": "no-cache",
      "postman-token": "52377699-a95d-cbcb-ef01-dfd8ef0bd697"
    }
  };


  var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });

  req.write(qs.stringify({ account: outhash }));
  req.end();
});

app.use(express.static('public_static'));
//Get autentication


app.get('/login',function(req,res) {
  res.render('login',{errorMessage:""});
});

app.post('/signUp', user.singUp, function(data) {
  console.log(data);
});
app.post('/signIn', user.singIn, function(req,res) {
  console.log("Entre ****");
});


app.get('/MetaCoin', function(req,res) {
  console.log(req.session);
  res.render('metacoin');
});

app.get('/genBlock', auth,function(req,res) {
  res.render('genBlock',{sesion:req.session,errorMessage:""});
});

app.get('/',function(req,res) {
  res.render('index');
});

app.get('/genActa', auth,function(req,res) {
  res.render('genActa',{sesion:req.session,errorMessage:""});
});

app.get('/getInfo', auth,function(req,res) {
    res.render('getInfoStudent',{sesion:req.session,errorMessage:""});
});

app.get('/getCertificate',function(req,res) {
  console.log(req.query);

  if (JSON.stringify(req.query)=='{}') {
      var hash = '';
  }else {
      var hash = req.query.hashCode;
  }
  console.log(hash);
  res.render('ConsultarActa', {codigo:hash});
});
app.get('/acta',function(req,res) {

  var dataActa = ['','','','','','','','']
  res.render('showActa', {acta: dataActa, hashCode:''});
});

app.get('/dataGenerada', auth,function(req,res) {
  var estudiante = "";
  var ApprovedSemester = "";
  var ApprovedPrepractica = "";
  var TotalApprove = "";
  var cod = "";
  var graduarse = "";
  res.render('dataGenerada', {Estudiante: estudiante , approvedSemester: ApprovedSemester, approvedPrepractica: ApprovedPrepractica, totalApprove: TotalApprove, cod: cod, graduar: graduarse,codeStudent1:0,sesion:req.session,errorMessage:""});
});

app.get('/getAccounts', (req, res) => {
  console.log("**** GET /getAccounts ****");
  truffle_connect.start(function (answer) {
    res.send(answer);
  })
});

app.get('/Matriculate', auth,function(req,res) {
  console.log(req.session);
  res.render('Matriculate',{hash:"null",sesion:req.session,errorMessage:""});
});


app.post('/getInfo',function(req,res) {
  console.log(req.body);
  let account = req.body.account;

  truffle_connect.getBlock(account,function(out) {
    //console.log(out);
    res.render('dataGenerada',{Estudiante: out[3], approvedSemester: out[0].toNumber(), approvedPrepractica: out[4], totalApprove: out[1].toNumber(), cod: out[6], graduar: out[2],codeStudent1:out[5].toNumber()});
  });
});
app.post('/getCertificate',function(req,res) {
  console.log(req.body);
  console.log("----------------------------------------------------------");
  let hashCode = req.body.hashCode;
  let dataActa;
  truffle_connect.getCertificate(hashCode,function(out) {
    console.log(out);
    dataActa = [out[0][0],out[0][2],out[0][3],out[0][4],out[0][5],out[0][6],out[1][0].toNumber(),out[1][1]];
    res.render('showActa',{acta: dataActa, hashCode:dataActa[7]});
  });
});

app.post('/genActa', function(req,res) {
  console.log(req.body);
  console.log(req.headers.referer);
  let date = (req.body.Date).split('-');
  let codeStudent = req.body.codeStudent;
  let account = req.body.account;
  let day = parseInt(date[2]);
  let month = parseInt(date[1]);
  console.log(day+"---------"+month);

    truffle_connect.genActa(codeStudent, day, month, account, creator, function functionName(out1) {
      //console.log(out1[0]);
      var prep;
      truffle_connect.getBlock(account,function(out2) {
        truffle_connect.getCertificate(out1[0],function(out) {
          //console.log(out);
          var estado;
          var name;
          let dataActa;
          console.log(out1[1]);
          if(out1[1]==='No puede graduarse'){
            estado = "No puede graduarse";
            name = out2[3];
          }else if(out1[1]==='No matriculado') {
            estado = "No existe el estudiante";
            name = "";
          }else{
            estado = out[0][6];
            name = out[0][0];
          }
          console.log(estado);
          dataActa = [name,out[0][2],out[0][3],out[0][4],out[0][5],estado,out[1][0].toNumber(),out[1][1]];
          //console.log(dataActa);
          res.render('showActa',{acta: dataActa, hashCode: out1[0]});
        });
      });
    });
});

app.post('/genBlock', function(req,res){
    console.log(req.body);
    let account = String(req.body.account);
    let approvedSemester = req.body.approvedSemester;
    let approvedPrepractica = req.body.approvedPrepractica;
    let prepractica;
    if(approvedPrepractica === 'false'){
      prepractica = false;
    }else {
      prepractica = true;
    }
      var canGraduate;
      var prep;
      truffle_connect.genBlock(account,parseInt(approvedSemester),prepractica, creator,function(out){
        console.log(out);
        if(out[4]){
          prep = "SI";
        }else {
          prep = "NO";
        }
        if(out[2]){
          canGraduate = "SI";
        }else {
          canGraduate = "NO";
        }
        res.render('dataGenerada',{Estudiante: out[3], approvedSemester: out[0].toNumber(), approvedPrepractica: prep, totalApprove: out[1].toNumber(), cod: out[6], graduar: canGraduate,codeStudent1:out[5].toNumber()});
      });
});

app.post('/Matriculate',function(req,res) {
  console.log("**** GET /Matriculate ****");
  console.log(req.body);
  let codeStudent = parseInt(req.body.codeStudent);
  let name = req.body.name;
  let ID2 = req.body.id;
  let degree = req.body.degree;
  let cel = parseInt(req.body.cel);
  let addressHome = req.body.addressHome;
  let creator = "0x8C3D5f3c20eC4529aa5664342B1564101C31d765";
    truffle_connect.matriculate(name, creator, degree, cel, addressHome, codeStudent, function functionName(out) {
      console.log(out);
      if(out[4]){
        prep = "SI";
      }else {
        prep = "NO";
      }
      if(out[2]){
        canGraduate = "SI";
      }else {
        canGraduate = "NO";
      }
        //res.render('Matriculate',{hash: out});
      res.render('dataGenerada',{Estudiante: out[3], approvedSemester: out[0].toNumber(), approvedPrepractica: prep, totalApprove: out[1].toNumber(), cod:out[6],  graduar: canGraduate, codeStudent1:out[5].toNumber()});
    });
  //});
});


app.post('/token',function(req,res) {
  console.log(req.body);
  req.session.token = req.body.token;
  console.log(req.session);
  res.redirect('/Matriculate');
});

app.post('/getBalance', (req, res) => {
  console.log("**** GET /getBalance ****");
  console.log(req.body);
  let currentAcount = req.body.account;

  truffle_connect.refreshBalance(currentAcount, (answer) => {
    let account_balance = answer;
    truffle_connect.start(function(answer){
      // get list of all accounts and send it along with the response
      let all_accounts = answer;
      response = [account_balance, all_accounts]
      res.send(response);
    });
  });
});

app.post('/sendCoin', (req, res) => {
  console.log("**** GET /sendCoin ****");
  console.log(req.body);

  let amount = req.body.amount;
  let sender = req.body.sender;
  let receiver = req.body.receiver;

  truffle_connect.sendCoin(amount, sender, receiver, (balance) => {
    res.send(balance);
  });
});

app.get('/logout', function (req, res, next) {
    if (req.session) {
	// delete session object
	req.session.destroy(function (err) {
	    if (err) {
		      return next(err);
	    } else {
		      return res.redirect('/getCertificate');
	    }
	});
    }
});

app.listen(port, () => {

  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    truffle_connect.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  console.log("Express Listening at http://localhost:" + port);

});

app.get('/layout',function(req,res) {
  console.log(req.session);
  res.render('layout', {sesion:req.session});
});

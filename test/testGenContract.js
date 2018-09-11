var GenCertificate = artifacts.require("./GenCertificate.sol");

contract('GenCertificate',function(accounts){
    var genCerti;
    var name = "Jose David Sanchez";
    var ID = "1017249975";
    var degree = "Ingeniería de sistemas";
    var cel = 3225967370;
    var addressHome = "Guarne";
    var codeStudent = 201510133010;

    var codeStudent2 = 201510082010;
    var name2 = "Mayerli Andrea Lopez Galeano";
    var ID2 = "1017248285";
    var degree2 = "Finanzas";
    var cel2 = 3106431585;
    var addressHome2 = "Medellín";

    var codeStudent3 = 201510058010;
    var name3 = "Dillan Alexis Muñeton Avendaño";
    var ID3 = "1017248152";
    var degree3 = "Ingeniería mecánica";
    var cel3 = 3106431583;
    var addressHome3 = "Medellín";


    var hashCode;
    var validacion;
    var cod;
    var account1;
    var account2 = accounts[1];
    var creator = accounts[9];
    console.log("llegue");
    it("Deberia matricular un estudiante",function(){
	     return GenCertificate.deployed().then(function(instance){
	        genCerti = instance;
          return genCerti.matriculate.call(name,degree,cel,addressHome,codeStudent, {from: creator});
       }).then(function(out){
           account1 = out;
	         genCerti.matriculate(name,degree,cel,addressHome,codeStudent, {from: creator});
	         return genCerti.getBlock.call(account1);
	     }).then(function(out){
	        console.log(out);
	     }).then(function(){
	        genCerti.genBlock(account1,14,false);
          return genCerti.getBlock.call(account1);
       }).then(function(out){
	        console.log(out);
	     }).then(function(){
	        genCerti.genBlock(account1,14,false);
          return genCerti.getBlock.call(account1);
       }).then(function(out){
	        console.log(out);
	     }).then(function(){
	        genCerti.genBlock(account1,14,false);
          return genCerti.getBlock.call(account1);
       }).then(function(out){
	        console.log(out);
	     }).then(function(){
	        genCerti.genBlock(account1,14,true);
          return genCerti.getBlock.call(account1);
       }).then(function(out){
	        console.log(out);
	     }).then(function(){
	        genCerti.genBlock(account1,14,false);
          return genCerti.getBlock.call(account1);
       }).then(function(out){
	        console.log(out);
	     }).then(function(){
	        genCerti.genBlock(account1,14,false);
          return genCerti.getBlock.call(account1);
       }).then(function(out){
	        console.log(out);
	     }).then(function(){
	        genCerti.genBlock(account1,14,false);
          return genCerti.getBlock.call(account1);
       }).then(function(out){
	        console.log(out);
	     }).then(function(){
	        genCerti.genBlock(account1,14,false);
          return genCerti.getBlock.call(account1);
       }).then(function(out){
	        console.log(out);
	     }).then(function(){
	        genCerti.genBlock(account1,14,true);
          return genCerti.getBlock.call(account1);
       }).then(function(out){
	        console.log(out);
	     }).then(function(){
	        genCerti.genBlock(account1,18,false);
          return genCerti.getBlock.call(account1);
       }).then(function(out){
	        console.log(out);
	     }).then(function(){
	        genCerti.genBlock(account1,18,false);
          return genCerti.getBlock.call(account1);
       }).then(function(out){
	        console.log(out);
	     }).then(function(){
	        genCerti.genBlock(account1,2,false);
          return genCerti.getBlock.call(account1);
       }).then(function(out){
	        console.log(out);
	     }).then(function(){
         return genCerti.matriculate.call(name2,degree2,cel2,addressHome2,codeStudent2, {from: creator});
       }).then(function(out){
          account2 = out;
          genCerti.matriculate(name2,degree2,cel2,addressHome2,codeStudent2,{from: creator});
          return genCerti.getBlock.call(account2);
	     }).then(function(out){
          console.log(out);
       }).then(function(){
	        genCerti.genBlock(account1,14,false);
          return genCerti.getBlock.call(account1);
       }).then(function(out){
	        console.log(out);
	     }).then(function(){
         return genCerti.genActa.call(codeStudent,24,4,account1);
       }).then(function(out) {
         cod = out[0];
         console.log(cod);
         return genCerti.genActa(codeStudent,24,4,account1);
       }).then(function(){
	        return genCerti.getCertificate.call(cod)
	     }).then(function(out){
         console.log(out);
	     }).then(function(){
	        return genCerti.getCertificateBlock.call(cod)
	     }).then(function(out){
         console.log(out);
	     }).then(function(){
	        genCerti.genBlock(account2,14,false);
          return genCerti.getBlock.call(account2);
       }).then(function(out){
	        console.log(out);
	     })
    });
});

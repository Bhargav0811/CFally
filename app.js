//jshint esversion:6
// import json
// import urllib.request
const exp = require("express");
const bodyp = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const findOrCreate = require("mongoose-findorcreate");
const cookieParser = require("cookie-parser");
// const $ = require("jquery")
const curl = require("curl");
const jsdom = require("jsdom");
const getJSON = require('get-json')
// const { JSDOM } = jsdom;
// var jsdom = require('jsdom');
const $ = require('jquery')(new jsdom.JSDOM().window);
var request = require('request');
// global.document = new JSDOM(html).window.document;

// getJSON('https://codeforces.com/api/user.info?handles=Bhargav0811',function(er,data){
//   console.log(data)
// })

// const json = node-fetch('https://codeforces.com/api/user.info?handles=Bhargav0811').then(res => res.json())
// // var json = parse.to_json('https://codeforces.com/api/user.info?handles=Bhargav0811');
// console.log(json)
// const json = require("json")
// const {request} = require()
// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// const { window } = new JSDOM(`...`);
// const { document } = (new JSDOM(`...`)).window;

const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config()

const app = exp();
app.use(exp.static("public"));
app.set("view engine","ejs");
app.use(bodyp.urlencoded({extended : true}));

app.use(session({
    secret: "SecretKey",
    saveUninitialized:true,
    cookie: { tab: 1,loadLogo: true,isErr: false,profile: {result:[]}},
    resave: false
}));


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://admin-bhargav:admin123@cluster1.yhr2kqj.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


// mongoose.connect("mongodb+srv://admin-bhargav:admin123@cluster1.yhr2kqj.mongodb.net/CF",{useNewUrlParser: true});
// mongoose.connect("mongodb://localhost:27017/WikiDB",{useNewUrlParser: true});
//mongoose.set("useCreateIndex",true)

// const usersch = new mongoose.Schema({
//   username: String,
//   password: String
// })
//
// usersch.plugin(findOrCreate);
//
// const user = new mongoose.model("user",usersch)
//

// with urllib.request.urlopen(user_URL) as url:
// 		user_data = json.loads(url.read().decode())
var tab = 1;
var loadLogo = true;
var isErr= false;
var profile = {result:[]}
var logFailed = false;
var LoggedIn = false;

app.get("/",function(req,res){
  res.render("home",{profile:profile,loadLogo:loadLogo,tab:tab,isErr:isErr,logFailed:logFailed})
})
app.get("/submit",function(req,res){
  if(req.isauthenticated()) res.render("submit")
  else res.redirect("/login");
})

app.get("/login",function(req,res){
  res.render("login",{MSG: ""})
})
app.get("/register",function(req,res){
  res.render("register",{MSG: ""})
})



app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/")
})

app.post("/search",function(req,res){
  var target = req.body.searchTarget
  var type = req.body['options-outlined']
  getJSON('https://codeforces.com/api/user.info?handles='+target,function(err,data){
    if(err===null)
    {
      profile = {result:data.result};
      loadLogo = false;
      tab = 2;
      isErr= false;
      logFailed=false;
    }
    else
    {
      profile = {result:[]};
      loadLogo = false;
      tab = 2;
      isErr= true;
      logFailed=true;
    }
    res.redirect("/");
    }).catch(error => {
    console.log(error)
  })
})

var A = []

app.post("/Home",function(req,res){
  var user = req.body.UN;
  var P = {};
  getJSON('https://codeforces.com/api/user.info?handles='+user,function(err,data){
    if(err===null)
    {
      P = data.result[0];
      getStats(user,function(){
        P.stats = st;
        P.friends = ["vasubeladiya","yash54","Brij_sojitra","jenil_kukadiya","Devansh11","jensibodrya","Jainam_Jain","dhruvin401"]
        P.Fr = {}
        var Frs = ""
        P.friends.forEach(function(I,index){
          Frs+=I+";"
        })
        getJSON('https://codeforces.com/api/user.info?handles='+Frs,function(err,data){
          data.result.forEach(function(F){
            P.Fr[F.handle] = [F.rating,F.titlePhoto]
          })
          console.log(P.Fr);
          console.log(P)
          LoggedIn = true;
          // console.log(P)
          res.render("Dash",{U:P,tab:1,loadLogo:true,logFailed:false})
        }).catch(error => {
        console.log(error)
      })

      })
    }
    else
    {
      profile = {result:[]};
      loadLogo = false;
      tab = 1;
      isErr= false;
      logFailed = true;
      if(LoggedIn)res.redirect("/Home");
      else res.redirect("/");
    }

    }).catch(error => {
    console.log(error)
  })
})

var st = {}
function getStats(ID,callback)
{
  var htmldata="";

  request('https://codeforces.com/profile/'+ID, function (error, response, body) {
    if(error){st = error;console.log(error);}
    else
    {
      htmldata=body;
    var regex = /<div class="_UserActivityFrame_counterValue">/gi, result, indices = [];
    while ( (result = regex.exec(htmldata)) ) {
        indices.push(result.index);
    }
    var stats = {}
    var field = ["AT","LY","LM","RM","RY","RM"]
    var s = ""
    indices.forEach(function(i,index){
      if(index<3)s = " problems</div>";
      else s = " days</div>";
      var k = htmldata.indexOf(s,i);
      stats[field[index]] = parseInt(htmldata.substr(i+45,k-i-45));
    });
    st =  stats;
    }
    if (typeof callback == "function"){callback();}
  });

}

app.listen(3000,function(){
  console.log("Server started on port 3000..");
});

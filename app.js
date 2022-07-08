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
const { plot } = require("plot");
require("@plotex/render-image");
const fs = require("fs");
// var Plotly = require('plotly.js-dist');
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
var URLs = {}

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
var Backs = [
"to right, #c6ffdd, #fbd786, #f7797d",
"0deg, #FFDEE9 0%, #B5FFFC 100%",
"45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%",
"160deg, #0093E9 0%, #80D0C7 100%",
"62deg, #8EC5FC 0%, #E0C3FC 100%",
"62deg, #FBAB7E 0%, #F7CE68 100%",
"45deg, #85FFBD 0%, #FFFB7D 100%",
"0deg, #D9AFD9 0%, #97D9E1 100%",
"19deg, #3EECAC 0%, #EE74E1 100%",
"45deg, #FBDA61 0%, #FF5ACD 100%",
"132deg, #F4D03F 0%, #16A085 100%",
"90deg, #FEE140 0%, #FA709A 100%" ]

app.post("/Home",function(req,res){
  var user = req.body.UN;
  var P = {};
  getJSON('https://codeforces.com/api/user.info?handles='+user,function(err,data){
    if(err===null)
    {
      P = data.result[0];
      if(P.titlePhoto==="https://cdn-userpic.codeforces.com/no-title.jpg")P.titlePhoto="A"+ (Math.floor(Math.random() * 3)+1) +".png";
      getStats(user,function(){
        P.stats = st;
        getJSON('https://codeforces.com/api/user.rating?handle='+user,function(err,Rs){

          P.ratingsList = Rs.result.map((a) => a.newRating)
          P.dates = Rs.result.map((a) => a.ratingUpdateTimeSeconds)
          // var data = [{
          //               x:dates,
          //               y:P.ratingsList,
          //               mode:"scatter"
          //             }];
          //   var layout = {
          //       title: 'Scroll and Zoom',
          //       showlegend: false
          //   };
          // // plot(P.ratingsList).renderImage("public/"+P.handle+".png");
          // // URLs.chartURL = P.handle+".png";
          //
          // // const imgDIV = document.getElementById("chartIMG");
          // // console.log(imgDIV);
          // Plotly.newPlot("chartIMG", data, layout, {scrollZoom: true});
          // Plotly.plot("chart", [trace1])
          // plot(P.ratingsList).renderDOM(imgDIV);
          P.friends = ["vasubeladiya","yash54","Brij_sojitra","jenil_kukadiya","Devansh11","jensibodrya","Jainam_Jain","dhruvin401"]
          P.Fr = {}
          var Frs = ""
          var backList =  Array.from({length: 8}, (_, i) => i + 1)
          // console.log(backList);
          backList =  backList.sort(() => Math.random() - 0.5)
          // console.log(backList);
          P.friends.forEach(function(I,index){
            Frs+=I+";"
          })
          getJSON('https://codeforces.com/api/user.info?handles='+Frs,function(err,data){
            data.result.forEach(function(F){
              if(F.titlePhoto==="https://cdn-userpic.codeforces.com/no-title.jpg")F.titlePhoto="A"+ (Math.floor(Math.random() * 3)+1) +".png";
              P.Fr[F.handle] = [F.rating,F.titlePhoto]
            })
            LoggedIn = true;
            // console.log(P)
            res.render("Dash",{U:P,tab:1,loadLogo:true,logFailed:false,back:Backs,backList:backList.slice(0,6)})

            }).catch(error => {console.log(error)})
            // console.log(P.Fr);
            // console.log(P)
        }).catch(error => {console.log(error)});
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

    }).catch(error => {console.log(error)})
})

function changeTab(a)
{
  tab=a;
}

var st = []
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
        // console.log(htmldata.substr(result.index,100));
    }
    var stats = []
    var field = ["All Time","Last Year","Last Month","In Row(Max)","In Row(Month)","In Row(Year)"]
    var s = ""
    indices.forEach(function(i,index){
      if(index<3)s = " problems</div>";
      else s = " days</div>";
      var k = htmldata.indexOf(s,i);
      stats.push([field[index],parseInt(htmldata.substr(i+45,k-i-45))])
    });
    // console.log(stats)
    st =  stats;
    }
    if (typeof callback == "function"){callback();}
  });

}

// <%# <% var data = [{x:U.dates,y:U.ratingsList,mode:"scatter"}] %> %>
// <%# <% var layout = { title: 'Scroll and Zoom', showlegend: false } %> %>
// <%# <%    console.log(data) %> %>
// <%# <%    console.log(layout) %> %>
app.listen(3000,function(){
  console.log("Server started on port 3000..");
});

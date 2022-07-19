//jshint esversion:6
// import json
// import urllib.request
const exp = require("express");
const bodyp = require("body-parser");
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
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
const { JSDOM } = jsdom;
const getJSON = require('get-json')

const { window } = new JSDOM();
var { document } = (new JSDOM('')).window;
global.document = document;
var $ = require("jquery")(window);


// const { JSDOM } = jsdom;
// var jsdom = require('jsdom');
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
//   password: String,
//  friends: [String]
// })
//
// usersch.plugin(findOrCreate);
//
// const user = new mongoose.model("user",usersch)
//

// with urllib.request.urlopen(user_URL) as url:
// 		user_data = json.loads(url.read().decode())

mongoose.connect("mongodb+srv://admin-bhargav:admin123@cluster1.yhr2kqj.mongodb.net/CFally",{useNewUrlParser: true});
const usersch = new mongoose.Schema({
  username: String,
  password: String,
  friends: [String]
})

usersch.plugin(findOrCreate);

const user = mongoose.model("user",usersch)

var tab = 1;
var loadLogo = true;
var isErr= false;
var profile = {result:[]}
var logFailed = false;
var loggedIn = false;
var profSearched = false;
var warningMSG = "";
var isFriend = 0;
var scrollPg = false;

var dom;

app.get("/",function(req,res){
  loggedIn=false;isFriend=0;
  res.render("home",{profile:profile,loadLogo:loadLogo,tab:tab,isErr:isErr,logFailed:logFailed,isFriend:isFriend})
})
app.post("/",function(req,res){
  res.redirect("/");
})

app.post("/search",function(req,res){
  var target = req.body.searchTarget;
  // var type = req.body['options-outlined']
  // console.log(tab,loadLogo ,isErr, profile, logFailed ,loggedIn ,profSearched);
  searchProf(target,function(){
    res.redirect("/");
  });

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

var P = {};
var backList = [];

app.get("/Home",function(req,res){

  if(loggedIn) {
    if(profSearched){loadLogo=false;}
    res.render("Dash",{U:P,tab:1,loadLogo:loadLogo,logFailed:false,back:Backs,backList:backList.slice(0,6),profSearched:profSearched,profile:profile,isErr:isErr,isFriend:isFriend,scrollPg:scrollPg})
    //   document =  (new JSDOM(result)).window.document;
    //   global.document = document;
  }
  else{ res.redirect("/")}
})

function toggle() {
    // var { document } = (new JSDOM()).window;
    // global.document = document;
    var blur=global.document.getElementById('blur');
    // $('#blur').toggleClass('active');
    blur.classList.toggle('active');
    var popup = global.document.getElementById('popup');
    popup.classList.toggle('active');
    // $('#popup').toggleClass('active');
    // console.log("Toggled Inside");
}

app.post("/Home/removeFrd",function(req,res){
  P.friends.splice(P.friends.indexOf(req.body.F2),1);
  user.updateOne({username:req.body.F1},{friends:P.friends},function(err,docs){
    if (err)console.log(err);
    else{
      // console.log("Updated Succesfully");
      // console.log(docs);
    }
  })
  loadLogo=false;
  scrollPg=true;
  profSearched=false;
  res.redirect("/Home");
})


app.post("/Home",function(req,res){
  // console.log(req.body);
  if(profSearched)
  {
    // console.log(P.friends);
    P.friends.push(req.body.F2);
    P.Fr[req.body.F2] = [req.body.F2rating,req.body.F2image]
    // console.log(P.friends);
    user.updateOne({username:req.body.F1},{friends:P.friends},function(err,docs){
      if (err)console.log(err);
      else{
        // console.log("Updated Succesfully");
        // console.log(docs);
      }
    })
    isFriend=1;
    profSearched=false;
    res.redirect("/Home")

  }
  else
  {
  var userN = req.body.UN;
  var pass = req.body.PS;
  getJSON('https://codeforces.com/api/user.info?handles='+userN,function(err,data){
    if(err===null)
    {
      var temp = P;
      P = data.result[0];

      if(!('OPT' in req.body))
      {
        const U1 = new user({username:userN,password:pass,friends:[]})
        P.friends =  U1.friends;
        U1.save();
        // request({
        // url: '/Home',
        // method: 'POST',
        // json:
        // },function(error, response, body){console.log(body);});
      }
      user.find({username:userN,password:pass},function (err, docs){
          if (err)console.log(err);
          else{
            // console.log(docs);
            if(docs.length===0)
            {
              profile = {result:[]};
              loadLogo = false;
              tab = 1;
              isErr= false;
              logFailed = true;
              if(loggedIn){
                // console.log("First Signup..");
                P = temp;
                res.redirect("/Home");}
              else {P={};res.redirect("/");}
            }
            else
            {
              P.friends =  docs[0].friends
              if(P.titlePhoto==="https://cdn-userpic.codeforces.com/no-title.jpg")P.titlePhoto="A"+ (Math.floor(Math.random() * 3)+1) +".png";
              getStats(userN,function(){
                P.stats = st;
                getJSON('https://codeforces.com/api/user.rating?handle='+userN,function(err,Rs){
                  P.dates = Rs.result.map((a) => a.ratingUpdateTimeSeconds);
                  if(P.dates.length===0)
                  {
                    P.ratingsList = []
                  }
                  else
                  {
                    P.ratingsList = Rs.result.map(function(value,label){
                      const inDate = new Date(value.ratingUpdateTimeSeconds*1000).toLocaleDateString('en-GB');
                      return {
                        x:inDate,y:value.newRating
                      }
                    });
                  }

                  // console.log(P.ratingsList);

                  P.Profsearched = false;

                  P.Fr = {}
                  var Frs = ""
                  backList =  Array.from({length: 8}, (_, i) => i + 1)
                  // console.log(backList);
                  backList =  backList.sort(() => Math.random() - 0.5)
                  // console.log(backList);
                  P.friends.forEach(function(I,index){
                    Frs+=I+";"
                  })
                  // console.log(P,Frs);
                  if(Frs===""){loggedIn = true;res.redirect("/Home");}
                  else
                  {
                    getJSON('https://codeforces.com/api/user.info?handles='+Frs,function(err,data){

                      data.result.forEach(function(F){
                        if(F.titlePhoto==="https://cdn-userpic.codeforces.com/no-title.jpg")F.titlePhoto="A"+ (Math.floor(Math.random() * 3)+1) +".png";
                        P.Fr[F.handle] = [F.rating,F.titlePhoto]
                      })
                      loggedIn = true;
                      // console.log(P)
                      res.redirect("/Home")
                      // res.render("Dash",{U:P,tab:1,loadLogo:true,logFailed:false,back:Backs,backList:backList.slice(0,6)})

                      }).catch(error => {console.log(error)})
                  }

                    // console.log(P.Fr);
                    // console.log(P)
                }).catch(error => {console.log(error)});
                })
            }

            }})

        // P.friends = ["vasubeladiya","yash54","Brij_sojitra","jenil_kukadiya","Devansh11","jensibodrya","Jainam_Jain","dhruvin401"]

      }
    else
    {
      profile = {result:[]};
      loadLogo = false;
      tab = 1;
      isErr= false;
      logFailed = true;
      if(loggedIn)res.redirect("/Home");
      else res.redirect("/");
    }
    }).catch(error => {console.log(error)})
  }
})

app.post("/Home/sort/:option",function(req,res){
  // console.log(P.friends)
  if(req.params.option==="1")
  {
    P.friends =  P.friends.sort((a, b) => {
      return a.localeCompare(b, undefined, {sensitivity: 'base'});
    });
  }
  else
  {
    P.friends = P.friends.sort(function compareRating(a,b){return P.Fr[b][0]-P.Fr[a][0];});
  }
  // console.log(P.friends)
  scrollPg=true;
  loadLogo=false;
  res.redirect("/Home");
})

app.post("/Home/Search",function(req,res){
  if(profSearched===true)
  {
    profile = {result:[]};
    profSearched=false;
    res.redirect("/Home");
  }
  else
  {
    var target = req.body.searchTarget;
    profSearched = true;
    // var type = req.body['options-outlined']
    // console.log(tab,loadLogo ,isErr, profile, logFailed ,loggedIn ,profSearched)
    searchProf(target,function(){
      // console.log("Redirecting to Home")
      if(P.handle===target || P.friends.includes(target))isFriend=1;
      else isFriend=2;
      res.redirect("/Home");
    });
  }
})

function searchProf(target,callback)
{
  getJSON('https://codeforces.com/api/user.info?handles='+target,function(err,data){
    if(err===null)
    {
      // console.log("Hello-Got");
      profile = {result:data.result};
      loadLogo = false;
      tab = 2;
      isErr= false;
      logFailed=false;
    }
    else
    {
      // console.log("Hello-Failed");
      profile = {result:[]};
      loadLogo = false;
      tab = 2;
      isErr= true;
      logFailed=false;
    }
    if (typeof callback == "function"){callback();}
    }).catch(error => {
    console.log(error)
  })
}
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
    var field = ["All Time","Last Year","Last Month","Row(Max)","Row(Month)","Row(Year)"]
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


app.listen(process.env.PORT || 3000,function(){
  console.log("Server started");
});

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

// <%# <% var data = [{x:U.dates,y:U.ratingsList,mode:"scatter"}] %> %>
// <%# <% var layout = { title: 'Scroll and Zoom', showlegend: false } %> %>
// <%# <%    console.log(data) %> %>
// <%# <%    console.log(layout) %> %>

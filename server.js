const express=require("express");
const bodyparser=require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session'); 
const fs = require("fs"); 
const path = require("path"); 
const upload = require("./middlewares/upload");
const transport = require("./middlewares/transport");
const Gallery = require("./models/galleryModel");
const Report = require("./models/reportModel");
const Blog = require("./models/blogModel");
const Team = require("./models/teamModel");
const Event = require("./models/eventModel");
const isAuth = require("./util");
const PORT = process.env.PORT;
const USER = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const MONGODB_URL = process.env.MONGODB_ADDON_URI;
const app=express();
let login = false;
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(express.static("public"));
app.use(session({
    secret: 'legalAidCentre-Lucknow',
    resave: false,
    saveUninitialized: true,
    cookie: { expires: false}
}));


app.set("view engine", "ejs");


mongoose.connect(MONGODB_URL,{ useNewUrlParser: true, useUnifiedTopology: true }, err => { 
        console.log('connected') 
    }); 

app.listen(PORT,function(req,res){
    console.log("server listening");
});

app.get("/",function(req,res){
    res.render("index",{ isAuth : login });
});

app.get("/team",async function(req,res){
    let core;

    Team.find({category : "Core"}, (err,items) => {
        if(err){
            console.log(err);
        }else{
            core = items;
        }
    });
    Team.find({category : "Others"}, (err, items)=>{
        if(err){
            console.log(err);
        }else{
            res.render("team", {coremember : core, othermember : items, isAuth : login});
        }
    });
});

app.get("/gallery",function(req,res){
    Gallery.find({},(err,items) => {
        if(err){
            console.log(err);
        }else{
            res.render("gallery", { photos : items,isAuth : login });
        }
    });
});

app.get("/reports",function(req,res){
    Report.find({},(err,items) => {
        if(err){
            console.log(err);
        }else{
            res.render("reports", { reports : items , isAuth : login });
        }
    });
});

app.get("/reports/:id",function(req,res){
    const id = req.params.id;
    Report.find({ _id : id }, (err,item) => {
        if(err){
            console.log(err);
        }else{
            res.render("report", { report : item , isAuth : login });
        }
    });
});

app.get("/reports/:title",function(req,res){
    const title = req.params.title;
    Report.find({title: title},(err,items) => {
        if(err){
            console.log(err);
        }else{
            res.render("reports", { reports : items });
        }
    });
});

app.get("/blog",function(req,res){
    let blog;
    console.log("cameeee");
    Blog.find({},(err,items) => {
        if(err){
            console.log(err);
        }else{
            blog = items;
        }
    });
    const year = new Date().getFullYear()
    const date = new Date(year.toString()+"-01-01");
    Blog.find({date : {$gte: date}}, (err, items)=>{
        if(err){
            console.log(err);
        }else{
            res.render("blog", {blogs : blog, recent : items,isAuth : login});
        }
    });
});

app.get("/pastevents",function(req,res){
    let event;
    const year = new Date().getFullYear()
    const date = new Date((year).toString()+"-01-01");
    const enddate = new Date((year-1).toString()+"-12-31");
    Event.find({date : {$lt: enddate}},(err,items) => {
        if(err){
            console.log(err);
        }else{
            event = items;
        }
    });
    Event.find({date : {$lt: date}}, (err, items)=>{
        if(err){
            console.log(err);
        }else{
            res.render("pastevents", {events : event, recent : items, isAuth : login});
        }
    })
});

app.get("/upevents",function(req,res){
    const year = new Date().getFullYear()
    const month = new Date().getMonth()
    const day = new Date().getDate()
    const date = new Date(year.toString()+'-'+month.toString()+'-'+day.toString());
    Event.find({date : {$gte: date}}, (err, items)=>{
        if(err){
            console.log(err);
        }else{
            res.render("upevents", {upevents : items, isAuth : login});
        }
    })
});

app.get("/CaseRegistration",function(req,res){
    res.render("CaseRegistration",{ isAuth : login });
});

app.post("/CaseRegistration",function(req,res){
    const name = req.body.name;
    const age = req.body.age;
    const address = req.body.address;
    const problem = req.body.problem;
    const number = req.body.number;
    const mailContent = {
        from: 'lucknowlegalaid@gmail.com',
        to: '2017-18cse51@nec.edu.in',
        subject: 'New Case Registered',
        text: "name : "+ name + "\nage : "+ age + "\naddress : " + address +"\nproblem : "+ problem + "\nContact number : " + number
    }
    transport.sendMail(mailContent, function(err,res){
        if(err){
            res.status(500).send({message : "Mail not sent"});
        }else{
            res.redirect("/CaseRegistration");
        }
    });
});

app.get("/certi",function(req,res){
    res.render("certi",{ isAuth : login });
});

app.get("/contact",function(req,res){
    res.render("contact",{ isAuth : login });
});
app.post("/contact",function(req,res){
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;
    const number = req.body.number;
    const mailContent = {
        from: 'lucknowlegalaid@gmail.com',
        to: '2017-18cse51@nec.edu.in',
        subject: 'New query raised',
        text: "name : "+ name + "\nemail : "+ email + "\nquery : " + message + "\nContact number : " + number
    }
    transport.sendMail(mailContent, function(err,res){
        if(err){
            res.status(500).send({message : "Mail not sent"});
        }else{
            res.redirect("/contact");
        }
    });
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",function(req,res){
    const uName = req.body.username;
    const password = req.body.password;
    if (uName === USER && password === PASSWORD){
        req.session.user = uName;
        login = true;
    }
        res.redirect("/");
});

app.get("/logout",function(req,res){
        req.session.destroy();
        login = false;
        res.redirect("/");
});

app.get("/manageGallery", isAuth , function(req,res){
    Gallery.find({},{img : 1 , _id : 1},(err,items)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("manageGallery", {photos : items, isAuth : login});
        }
    })
});

app.post("/manageGallery/deletePhoto/:id", isAuth ,function(req,res){
    const id = req.params.id;
    Gallery.deleteOne({ _id : id },(err,items)=>{
        if(err){
            console.log(ërr);
        }
        else{
            res.redirect("/manageGallery");
        }
    });
});

app.post("/manageGallery", isAuth , upload.single('img') , async (req,res,next)=>{
    const desc = req.body.desc;
    const formData = {
        description: desc,
        img:{
            data: fs.readFileSync(path.join(__dirname + '/middlewares/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    try {
        fs.unlinkSync(__dirname + '/middlewares/' + req.file.filename);
      } catch (err) {
        console.log(err);
      }
      Gallery.create(formData,(err,item)=>{
          if(err){
            return res.status(500).send({message: "not uploaded"});
          }
          else{
            res.redirect("/manageGallery");
          }
      })
});

app.get("/manageReports", isAuth , function(req,res){
    Report.find({}, (err,items)=>{
        if(err){
            console.log(err)
        }
        else{
            res.render("manageReports",{ reports : items , isAuth : login});
        }
    })
});

app.post("/manageReports", isAuth ,upload.single('pdf'),function(req,res){
    const title = req.body.title;
    const formData = {
        title: title,
        pdf:{
            data: fs.readFileSync(path.join(__dirname+'/middlewares/'+req.file.filename)),
            contentType: 'application/pdf'
        }
    }
    try {
        fs.unlinkSync(__dirname + "/middlewares/" + req.file.filename);
      } catch (err) {
        console.log(err);
      }
      Report.create(formData,(err,item)=>{
          if(err){
            return res.status(500).send({message: "not uploaded"});
          }
          else{
            return res.redirect("/manageReports");
          }
      })
});

app.post("/manageReports/deleteReport/:id", isAuth ,function(req,res){
    const id = req.params.id;
    Report.deleteOne({ _id : id },(err,items)=>{
        if(err){
            console.log(ërr);
        }
        else{
            res.redirect("/manageReports");
        }
    });
});

app.get("/manageBlogs", isAuth ,function(req,res){
    Blog.find({},{title : 1, date : 1, authorName : 1},(err,items)=>{
        if(err){
            console.log(err);
        }
        else{
    res.render("manageBlogs", {blogs : items, isAuth : login});
        }
    })
});
app.post("/manageBlogs", isAuth ,upload.single('img'),async (req,res,next)=>{
    console.log(req.file);
    const title = req.body.title;
    const desc = req.body.desc;
    const cap = req.body.caption;
    const date = req.body.date;
    const formData = {
        title: title,
        date: date,
        description: desc,
        caption: cap,
        img:{
            data: fs.readFileSync(path.join(__dirname+'/middlewares/'+req.file.filename)),
            contentType: 'image/png'
        }
    }
    try {
        fs.unlinkSync(__dirname + '/middlewares/' +req.file.filename);
      } catch (err) {
        console.log(err);
      }
      Blog.create(formData,(err,item)=>{
          if(err){
            return res.status(500).send({message: err});
          }
          else{
            return res.redirect("/manageBlogs");
          }
      })
});

app.get("/manageEvents", isAuth ,function(req,res){
    Event.find({},{title: 1, date: 1, winner: 1, runner: 1},(err,items)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("manageEvents", {events : items, isAuth : login});
        }
    })
});

app.post("/manageEvents", isAuth ,upload.single('img'),async (req,res,next)=>{
    const title = req.body.title;
    const desc = req.body.desc;
    const date = req.body.date;
    const time = req.body.time;
    const place = req.body.place;
    const winner = req.body.winner;
    const runner = req.body.runner;
    const formData = {
        title: title,
        date: date,
        place: place,
        time: time,
        winner: winner,
        runner: runner,
        description: desc,
        img:{
            data: fs.readFileSync(path.join(__dirname+'/middlewares/'+req.file.filename)),
            contentType: 'image/png'
        }
    }
    try {
        fs.unlinkSync(__dirname + '/middlewares/' +req.file.filename);
      } catch (err) {
        console.log(err);
      }
      Event.create(formData,(err,item)=>{
          if(err){
            return res.status(500).send({message: "not uploaded"});
          }
          else{
            return res.redirect("/manageEvents");
          }
      })
});

app.post("/manageEvents/announce/:id", isAuth ,function(req,res){
    const id = req.params.id;
    const winner = req.body.winner;
    const runner = req.body.runner;
    Event.findOneAndUpdate({ _id : id },{winner : winner, runner: runner},(err,items)=>{
        if(err){
            console.log(ërr);
        }
        else{
            res.redirect("/manageEvents");
        }
    });
});

app.post("/manageTeam/deleteMember/:id", isAuth ,function(req,res){
    const id = req.params.id;
    Team.deleteOne({ _id : id },(err,items)=>{
        if(err){
            console.log(ërr);
        }
        else{
            res.redirect("/manageTeam");
        }
    });
});

app.post("/manageBlogs/author/:id", isAuth ,upload.single('img'),function(req,res){
    const id = req.params.id;
    const name = req.body.name;
    const detail = req.body.detail;
    const update = {
        authorName: name,
        authorDetail: detail,
        authorImg:{
        data: fs.readFileSync(path.join(__dirname+'/middlewares/'+req.file.filename)),
        contentType: 'image/png'
         }
    };
    try {
        fs.unlinkSync(__dirname + '/middlewares/' +req.file.filename);
    } catch (err) {
    console.log(err);
    }
    Blog.findOneAndUpdate({ _id : id },update,(err,items)=>{
    if(err){
        console.log(ërr);
    }
    else{
        console.log(items);
        res.redirect("/manageBlogs");
       }
    });
});

app.post("/manageBlogs/deleteBlog/:id", isAuth ,function(req,res){
    const id = req.params.id;
    Blog.deleteOne({ _id : id },(err,items)=>{
        if(err){
            console.log(ërr);
        }
        else{
            res.redirect("/manageBlogs");
        }
    });
});

app.post("/manageEvents/deleteEvent/:id", isAuth ,function(req,res){
    const id = req.params.id;
    Event.deleteOne({ _id : id },(err,items)=>{
        if(err){
            console.log(ërr);
        }
        else{
            res.redirect("/manageEvents");
        }
    });
});

app.get("/manageTeam", isAuth ,function(req,res){
    let core;
    Team.find({category : "Core"}, (err,items) => {
        if(err){
            console.log(err);
        }else{
            core = items;
        }
    });

    Team.find({category : "Others"}, (err, items)=>{
        if(err){
            console.log(err);
        }else{
            res.render("manageTeam", {coremember : core, othermember : items, isAuth : login});
        }
    });
});
app.post("/manageTeam", isAuth ,upload.single('img'),async (req,res,next)=>{
    const name = req.body.name;
    const cat = req.body.category;
    const formData = {
        name: name,
        category: cat,
        img:{
            data: fs.readFileSync(path.join(__dirname+'/middlewares/'+req.file.filename)),
            contentType: 'image/png'
        }
    }
    try {
        fs.unlinkSync(__dirname + '/middlewares/' +req.file.filename);
      } catch (err) {
        console.log(err);
      }
      Team.create(formData,(err,item)=>{
          if(err){
            return res.status(500).semd({message : "Not uploaded"});
          }
          else{
            return res.redirect("/manageTeam");
          }
      })
});

app.get("/:id",async function(req,res){
    const id = req.params.id;
    console.log(id);
    let blog;
    await Blog.find({ _id: id },(err,item) => {
        if(err){
            console.log(err);
        }else{
    console.log(item);
            blog = item;
        }
    });
    console.log(blog)
    await Blog.find({_id : {$ne: id}}, (err, items)=>{
        if(err){
            console.log(err);
        }else{
    res.render("singleBlog", {blog: blog, other: items, isAuth : login});
        }
    });

});

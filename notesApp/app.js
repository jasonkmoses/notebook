//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const noteSchema = {
text: String,
date: String,
color:String
};
var colorList = [
  "#A683E3","#e39d83","#83bbe3",
  "#e38383","#83e3d6","#e38383","#83e3bf"
];
mongoose.connect('mongodb+srv://johnWinter:dw2SaLFBt10U7hRx@cluster0.s3zgw.mongodb.net/Notes?retryWrites=true&w=majority',{ useNewUrlParser: true });
const Notes = mongoose.model("Notes", noteSchema);
var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var d = new Date();
var date = d.getDate();
var month = d.getMonth();
var year = d.getFullYear();
app.get("/", function (req, res) {
  Notes.find({}, function(err, notesInfo) {
    res.render("home", {
      notesInfo: notesInfo
    });
  });
});
app.post("/", function (req, res) {
  const notes = new Notes ({
    text: req.body.noteText,
    date: date + " " + months[month] + " " + year,
    color: colorList[Math.floor((Math.random() * 7) + 1)]
  });
  notes.save(function(err) {
    if (!err) {
      res.redirect("/");
    }});
  });
app.post("/edit/:noteId", function (req, res) {
const requestedNoteId = req.params.noteId;
  Notes.updateOne({ _id: requestedNoteId }, {
      text: req.body.noteText2,
      date: date + " " + months[month] + " " + year
    }, function (err,r) {
    if (!err) {
      res.redirect("/");
    }
  });
});
app.post("/delete/:noteId", function (req, res) {
  const requestedNoteId = req.params.noteId;
  Notes.deleteOne({ _id: requestedNoteId }, function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});
app.get("/edit/:noteId", function (req, res) {
const requestedNoteId = req.params.noteId;
res.redirect("home");
});
app.get("/delete/:noteId", function (req, res) {
const requestedNoteId = req.params.noteId;
res.redirect("home");
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000; }
app.listen(port, function() {});

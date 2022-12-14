//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const _ = require("lodash");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://admin-Samudra:samudra123@cluster0.pddvyii.mongodb.net/todolistDB');
}
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];
const itemsSchema = new mongoose.Schema({
  name: String
});
const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});
const List = mongoose.model('List', listSchema);
const item = mongoose.model('item', itemsSchema);
const item1 = new item({ name: 'Enter the things u want to do today' });
const item2 = new item({ name: 'Click on + to add a new item' });
const item3 = new item({ name: '<--- hit this to delete an item' });
let defaultitems=[item1,item2,item3];

// item.deleteMany({ name: "Eat" });
// item.deleteMany({ name: "Sleep" });
// item.deleteMany({ name: "Work" });
app.get("/", function(req, res) {
item.find({},function(err,founditems){
  if(founditems.length==0)
  {
    item.insertMany(defaultitems, function(err) {
      if(err)
      console.log(err);
      else
      console.log("yayy");
    });
    res.redirect("/");
  }
  else
  {
    res.render("list", {listTitle: "Today", newListItems: founditems});
  }

})
// const day = date.getDate();
  // for(let i=0;i<defaultitems.length;i++)
  // {
  //   console.log(defaultitems[i].name);
  // }


});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.listName;
  // console.log(req.body);
  const nitem = new item({ name: itemName });
  if(listName== "Today")
  {
    nitem.save();
    res.redirect("/");
  }
  else
  {
    List.findOne({name: listName},function(err,foundlist){
      if(!err)
      {
        foundlist.items.push(nitem);
        foundlist.save();
        res.redirect("/"+listName);
      }
      else
      {
        console.log(err);
      }
    })
  }
  // res.redirect('back');
  // res.redirect("/");
});

// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

// app.get("/about", function(req, res){
//   res.render("about");
// });

app.get("/:customListName",function(req,res){
  const cln= _.capitalize(req.params.customListName);
  List.findOne({name: cln},function(err,foundlist){
    if(!err)
    {
      if(!foundlist)
      {
        const list = new List({
          name: cln,
          items:defaultitems
        });
        list.save();
        res.redirect("/"+cln);
      }
      else
      {
        res.render("list", {listTitle: foundlist.name, newListItems: foundlist.items});
      }
    }
    else
    {
      console.log(err);
    }
  })

// list.save();
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
app.post("/delete",(req,res)=>{

  const checkedId=req.body.checkbox;
  const listname = req.body.listname;
  if(listname=="Today"){
    item.findByIdAndRemove(checkedId,function(err){
      if(err)
      console.log(err);
      else
      {
        console.log("Removed");
        res.redirect("/");
      }
    });
  }
  else
  {
    // console.log(req.body);
    List.findOneAndUpdate({name: listname},{$pull:{items:{_id:checkedId}}},function(err,foundlist){
      if(!err)
      {
        res.redirect("/"+listname);
      }
      else
      {
        console.log(err);
      }
    });
  }
});

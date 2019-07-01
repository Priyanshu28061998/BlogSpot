var express=require("express");
var app=express();
var bodyparser=require("body-parser");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
//APP CONFIG
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost/blogSpot");
//BLOG CONFIG
var BlogSchema=new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date,default:Date.now}

});
var Blog=mongoose.model("Blog",BlogSchema);
//RestFul Routing
app.get("/",function(req,res){
	res.redirect("/blogs");
})
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err)
		{
			console.log("Error!!");
		}
		else
		{
			res.render("index",{blogs:blogs});
		}
	})
})

app.get("/blogs/new",function(req,res){
	res.render("new");
})

app.post("/blogs",function(req,res){

	var x1=req.body.image;
    var x2=req.body.title;
	var x3=req.body.body;

	var temp={
          title:x2,
          image:x1,
          body:x3
	};
    Blog.create(temp,function(err,newBlog){
    	if(err)
    	{
    		res.render("new");
    	}
    	else
    	{
    		res.redirect("/blogs");
    	}
    })
})

app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err)
		{
			res.redirect("/blogs");
		}
		else
		{
			res.render("show",{blog:foundBlog});
		}
	})
})

app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err)
		{
			res.direct("/blogs/"+req.params.id);
		}
		else
		{
			res.render("edit",{blog:foundBlog});
		}
	})
})

app.put("/blogs/:id",function(req,res){
	var temp={
		title:req.body.title,
		image:req.body.image,
		body:req.body.body
	}
	Blog.findByIdAndUpdate(req.params.id,temp,function(err,foundBlog){
		if(err)
		{
			res.redirect("/blogs");
		}
		else
		{
			res.redirect("/blogs/"+req.params.id);
		}
	})
})

app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err,foundBlog){
		if(err)
		{
			res.redirect("/blogs");
		}
		else
		{
			res.redirect("/blogs");
		}
	})
})


app.listen(2806,function(){
	console.log("blogSpot started!!");
})

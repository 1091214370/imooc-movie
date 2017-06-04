var express= require('express');
var path =require('path');
var _=require('underscore');
var mongoose=require('mongoose');
var Movie=require('./models/movie');
var port =process.env.PORT||3000;
var bodyParser = require('body-parser'); 
var app =express();

mongoose.connect('mongodb://localhost:27017/imooc');
app.set('views','./views/page');
app.set('view engine','jade');
// app.use(express.bodyParser()); bodyparser已经不和Express绑定在一起了，而需要单独来安装，执行如下命令即可：npm install body-parser然后在代码中如下使用：var bodyParser = require('body-parser');  app.use(bodyParser());
app.use(bodyParser.json() );// 格式化表单提交
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.locals.moment=require('moment');
app.listen(port);

console.log('imooc start on port'+port);

//index  page 路由
app.get('/',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err);
		}

		res.render('index',{
			title:'imooc 首页',
			movies:movies
		});
	});
})

//detail  page 路由
app.get('/movie/:id',function(req,res){
  var id = req.params.id;
  Movie.findById(id,function(err,movie) {
    if(err) {
      console.log(err);
    }
    res.render('detail',{
      title:'imooc '+movie.title,
      movie:movie
    })
  })
})
//admin  page 路由
app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title:'imooc 后台录入页',
		movie:{
			title:'',
        	doctor:'',
        	country:'',
        	year:'',
        	poster:'',
        	flash:'',
        	summary:'',
        	language:'',
      }
	});
});
//admin update movie
app.get('/admin/update/:id',function(req,res){
	var id=req.params.id;
	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title:'imooc 后台更新页',
				movie:movie
			})
		})
	}
})
//admin post movie
app.post('/admin/movie/new',function(req,res) {
  var id = req.body.movie._id;
  var movieObj =req.body.movie;
  var _movie;
  if(id !== 'undefined'){
    Movie.findById(id,function(err,movie){
      if(err){
        console.log(err);
      }
      _movie = _.extend(movie,movieObj)
      _movie.save(function(err,movie) {
        if(err){
          console.log(err);
        }
        res.redirect('/movie/'+movie._id);
      })
    })
  }
  else{
    _movie = new Movie({
      doctor:movieObj.doctor,
      title:movieObj.title,
      country:movieObj.country,
      language:movieObj.language,
      year:movieObj.year,
      poster:movieObj.poster,
      summary:movieObj.summary,
      flash:movieObj.flash
    })
    _movie.save(function(err,movie) {
      if(err){
        console.log(err);
      }
      res.redirect('/movie/'+movie._id);
    })
  }
})


//list  page 路由
app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err);
		}

		res.render('list',{
			title:'imooc 管理',
			movies:movies
		});
	});
})

//delete 
app.delete('/admin/list',function(req,res) {
  var id = req.query.id;
  if(id) {
    Movie.remove({_id: id},function(err,movie) {
      if(err){
        console.log(err);
      }
      else{
        res.json({success: 1});
      }
    })
  }
})
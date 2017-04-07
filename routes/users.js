var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {
  	'title': 'Register'
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
  	'title': 'Login'
  });
});
 
router.post('/register', upload.single('profileimage'), function(req, res, next){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

//Check for Image Field
	if(req.files){
		//File Info
		var profileImageOrignalName 		= req.files.profileimage.originalname;
		var profileImageName 				= req.files.profileimage.name;
		var profileImageMime 				= req.files.profileimage.mimetype;
		var profileImagePath 				= req.files.profileimage.path;
		var profileImageExt					= req.files.profileimage.extension;
		var profileImageSize				= req.files.profileimage.size;

	}else{
		var profileImageName = 'noimage.jpg';
	}
	
	req.checkBody('name','name field is required').notEmpty();
	req.checkBody('email','Email Field is required').notEmpty();
	req.checkBody('email','Email not valid').isEmail();
	req.checkBody('username','Username Field is required').notEmpty();
	req.checkBody('password','Password Field is required').notEmpty();
	req.checkBody('password2','Passwords do not match').equals(req.body.password);

	//check for errors
	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors: errors,
			name: name,
			email: email,
			username: username,
			password: password,
			password2: password2
		});
	} else {
		var newUser = new User({
			name: name,
			email: email,
			username: password,
			password: password,
			profileimage: profileImageName

		});

		//Create User
		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success','Your are now registered and may log in');

		res.location('/');
		res.redirect('/');
	}

});	

module.exports = router;

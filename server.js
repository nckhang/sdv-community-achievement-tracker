var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models = require('./models')

// Initilize App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//Route files
var routes = require('./routes/routes');
var user = require('./routes/user');
var bundles = require('./routes/bundles');
var farmers = require('./routes/farmers');
var account = require('./routes/account');
var boilerroom = require('./routes/boilerroom');
var bulletinboard = require('./routes/bulletinboard');
var craftsroom = require('./routes/craftsroom');
var fishtank = require('./routes/fishtank');
var pantry = require('./routes/pantry');
var vault = require('./routes/vault');
var api = require('./routes/api');

//Regular routes
app.use('/', routes);
app.use('/user', user);
app.use('/user/farmers', farmers);
app.use('/user/account', account);
app.use('/bundles', bundles);
app.use('/bundles/boilerroom', boilerroom);
app.use('/bundles/bulletinboard', bulletinboard);
app.use('/bundles/craftsroom', craftsroom);
app.use('/bundles/fishtank', fishtank);
app.use('/bundles/pantry', pantry);
app.use('/bundles/vault', vault);
app.use('/api', api);

//404 routes
app.get('/user/*', function(req, res) {
  res.redirect('/user/login');
});
app.get('/bundles/*', function(req, res) {
  res.redirect('/bundles/dashboard');
});
app.get('/*', function(req, res) {
  res.redirect('/');
});

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
  console.log('Server started on port '+app.get('port'));
});
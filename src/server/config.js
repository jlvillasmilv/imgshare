const path = require('path');
const exphbs = require('express-handlebars');

const morgan = require('morgan');
const multer = require('multer');
const express = require('express');
const errorHandler = require('errorhandler');

const routes =  require('../routes/index');

module.exports = app => {

  // setting
  app.set('port', process.env.PORT || 4000);
  app.set('views', path.join(__dirname, '../views'));
  app.engine(".hbs", exphbs.engine({
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    defaulLayout: "main",
    extname: ".hbs",
    helpers: require('./helpers')
  }));

  app.set('view engine', 'hbs'); 
  
  // middleware
  app.use(morgan('dev'));
  app.use(multer({dest: path.join(__dirname, '../public/upload/temp')})
    .single('image'));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  //routes
  routes(app); 

  // static files
  app.use('/public', express.static(path.join(__dirname, '../public')));

  //error handlers
  if ('development' === app.get('env')) {
    app.use(errorHandler);
  }
  
  return app;
}

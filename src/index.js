const express = require('express');

const config = require('./server/config');

// starting the server
const app = config(express());

// database connection
require('./database');

app.listen(app.get('port'), () => {
  console.log('Serve on port'+ app.get('port'));
}); 

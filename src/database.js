const mongoose = require('mongoose');
const {database} = require('./keys');

mongoose.connect(database.URL, {
  useNewUrlParser: true

})
.then(db => console.log('Connected'))
.catch(err => console.error(err));

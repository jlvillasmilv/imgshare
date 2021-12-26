const ctrl = {};
const { Image } = require('../models');
const sidebar = require('../helpers/sidebar');

ctrl.index = async (req, res) => {
  const images = await Image.find()
    .sort({timestamp: -1})
    .lean({ virtuals: true });

  let viewModel = { images: [] };
  viewModel.images = images;
  viewModel = await sidebar(viewModel);
 
  console.log(viewModel.sidebar);
  res.render("index", viewModel);

};

module.exports = ctrl;

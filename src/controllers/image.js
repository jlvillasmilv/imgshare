const path = require('path');
const {randomNumber} = require('../helpers/libs');
const fs = require('fs-extra');
const md5 = require('md5');
const sidebar = require('../helpers/sidebar');

const { Image, Comment } = require('../models');

const ctrl = {};

ctrl.index = async (req, res, next) => {
  let viewModel = { image: {}, comments: {}};

  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  }).lean({ virtuals: true });
  
  
  // if image does not exists
  if (!image) return next(new Error("Image does not exists"));
  
  // increment views
  const updatedImage = await Image.findOneAndUpdate(
    { _id: image.id },
    { $inc: { views: 1 } }
  ).lean({ virtuals: true });
  
  viewModel.image = updatedImage;
  
  const comments = await Comment.find({image_id: image._id}).lean();
  
  viewModel.comments = comments;
  viewModel = await sidebar(viewModel);

  res.render("image", viewModel);

};

ctrl.create = async (req, res) => {
  let imgUrl = randomNumber();
  const images = await Image.find({filename: imgUrl});
  
  while (images.length > 0) {
    
    let imgUrl = randomNumber();
    images = await Image.find({filename: imgUrl});

  }

  const imageTempPath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();
  const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);
  
  if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
    await fs.rename(imageTempPath, targetPath);
    const newImg =  new Image({
      title: req.body.title,
      description: req.body.description,
      filename: imgUrl+ext
    });
    const imageSaved = await newImg.save();
    console.log(imageSaved);
    res.redirect('/images/'+imgUrl);
  } else {
    await fs.unlink(imageTempPath);
    res.status(500).json({error: 'Only Image files are allowed'})
  }
};

ctrl.like = async (req, res) => {

 const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  console.log(image);
  if (image) {
    image.likes = image.likes + 1;
    await image.save();
    res.json({ likes: image.likes });
  } else {
    res.status(500).json({ error: "Internal Error" });

  }};

ctrl.comment = async (req, res) => {

  const image = await Image.findOne({filename: {$regex: req.params.image_id}});
  
  if (image){
    const newComment = new Comment(req.body);
    newComment.gravatar = md5(newComment.email);
    newComment.image_id = image._id;
    await newComment.save();
    res.redirect('/images/'+ image.uniqueId);
    console.log(newComment);

  }

};

ctrl.remove = async(req, res) => {
  const image = await Image.findOne({filename: {$regex: req.params.image_id}});
  if (image) {
    await fs.unlink(path.resolve('./src/public/upload/'+image.filename));
    await Comment.deleteOne({image_id: image._id});
    await image.remove();
  }
  res.json(true);
};

module.exports = ctrl;

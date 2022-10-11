const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comments = await Comment.find({post: req.params.id}).sort({ createdAt: "desc" }).lean();
      res.render("post.ejs", { post: post, user: req.user, comments: comments });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        contact: req.body.contact,
        grade: req.body.grade,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  // Get Student to Edit
editStudent: async(req, res) => {
    try{

        let studentId = req.params.id
        limitNumber=1
        let studentById = await Post.findById({_id: studentId}).limit(limitNumber)
        res.render('/edit-student', {title: "Student Info-Edit", studentById})
    }catch(error){
        res.status(500).send({message: error.message || "Error Occurred"})
    }
},


//Edit Student on Post
editPost: async(req,res) => {
    try{
        req.body.user = req.body._id
        let studentId = req.params.id
        let studentById = await Post.findByIdAndUpdate({_id: studentId},{$set: {            
          title: req.body.title,
          image: result.secure_url,
          cloudinaryId: result.public_id,
          caption: req.body.caption,
          contact: req.body.contact,
          grade: req.body.grade,
        }})
            req.session.message = {
                type: 'success',
                message: 'User updated successfully.'
            }
            res.redirect("/post")
            console.log(studentById)
    }catch(error){
        res.status(500).send({message: error.message || "Error Occurred"})
    }
},


//Post/search
searchStudent: async(req, res) => {
    //searchTerm
    try{
        let searchTerm = req.body.searchTerm
        let limitNumber = 1
        let student = await Posts.find({$text: {$search: searchTerm, $diacriticSensitive: true}}).limit(limitNumber)
        res.render('search', {title: 'Student Info- Search', student} )
    }catch(error){
        res.status(500).send({message: error.message || "Error Occured"})
    }

},
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};

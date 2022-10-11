const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, postsController.getPost);

router.post("/createPost", upload.single("file"), postsController.createPost);

router.put("/likePost/:id", postsController.likePost);

router.get("/edit-student/:id", ensureAuth, postsController.editStudent);

router.get("/edit-student/:id", ensureAuth, postsController.editPost);

router.delete("/deletePost/:id", postsController.deletePost);

router.post("/search", postsController.searchStudent);

module.exports = router;

const Post = require("../models/postModel");
const User = require("../models/userModel");

const getMyPosts = async (req, res) => {
  try {
    const userId = req._id;
    const user = await User.findById(userId).populate("myPosts");
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }
    return res.status(200).send({ myPosts: user.myPosts });
  } catch (error) {
    return res.status(500).send({ message: "Doubt post not found!" });
  }
}

const createNewPost = async (req, res) => {
  const userId = req._id;
  const { title } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const post = await Post.create({
      title: title,
      owner: userId,
    });
    user.myPosts.push(post._id);
    await user.save();
    return res.status(201).send({ newPostUrl: post._id });
  } catch (error) {
    return res.status(500).send({ message: "Error creating post!" });
  }
}

const getAllPosts = async (req, res) => {
  const page = req.params.page || 1;
  const filterMode = req.params.filter || "latest";
  const pageSize = 50;
  try {
    const skip = (page - 1) * pageSize;

    let sortCriteria;
    switch (filterMode) {
      case "latest":
        sortCriteria = { createdAt: -1 };
        break;
      case "asc-upvotes":
        sortCriteria = { upvoteCount: 1 }
        break;
      case "dsc-upvotes":
        sortCriteria = { upvoteCount: -1 }
        break;
    }

    const posts = await Post.find({})
      .sort(sortCriteria)
      .skip(skip)
      .limit(pageSize)
      .populate("owner");

    const sortedPosts = posts.map((post) => ({
      title: post?.title,
      url: post?._id,
      upvotes: post?.upvotes,
      upvoteCount: post?.upvoteCount,
      createdAt: post?.createdAt,
      author: {
        username: post?.owner?.username,
        avatar: post?.owner?.picture,
      },
    }))
    return res.status(200).json(sortedPosts);
  } catch (error) {
    return res.status(500).send({ message: "Error retrieving posts!" });

  }
}

const create100 = async (req, res) => {
  try {
    const userId = req._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    for (let index = 0; index < 100; index++) {
      await Post.create({
        title: `Title ${index}`,
        owner: userId
      })
    }
    return res.status(200).json({ message: "100 posts created successfully!" });
  } catch (error) {
    return res.status(500).send({ message: "Error retrieving posts!" });
  }
}

const upvoteDoubt = async (req, res) => {
  const userId = req._id;
  const { postId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }
    const hasUpvoted = post.upvotes.includes(userId);
    if (hasUpvoted) {
      post.upvotes = post.upvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
      await post.save();
      const user = await User.findById(userId);
      user.upvotedPosts = user.upvotedPosts.filter(
        (id) => id.toString() !== postId
      );
      await user.save();
      return res.json({ message: "Upvote removed successfully" });
    } else {
      post.upvotes.push(userId);
      await post.save();
      const user = await User.findById(userId);
      user.upvotedPosts.push(postId);
      await user.save();
      return res.json({ message: "Post upvoted successfully" });
    }

  } catch (error) {
    return res.status(500).send({ message: "Error upvoting post, try again!" });
  }
}


module.exports = {
  createNewPost,
  getMyPosts,
  getAllPosts,
  upvoteDoubt,
  create100
}

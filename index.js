const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const Blog = require("./models/blog");

const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();
const PORT = 8000;

//Routes
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

//DB Connections
mongoose
  .connect("mongodb://127.0.0.1:27017/blogify")
  .then(() => console.log("MongoDB Connected !"));

//EJS
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  try {
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
    return res.render("home", {
      user: req.user,
      blogs: allBlogs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, console.log(`Server Started at PORT ${PORT}`));

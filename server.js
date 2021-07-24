const express = require("express");
const mongoose = require("mongoose");
const app = express();
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const crypto = require("crypto");
const path = require("path");
app.use(express.json());

const MONGO =
  "mongodb+srv://hardilsingh87:Hardil@123@cluster0.g2ub2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const connect = mongoose.createConnection(MONGO, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

let gfs;

connect.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(connect.db, {
    bucketName: "uploads",
  });
});

/**
 *
 * Storage
 */

const storage = new GridFsStorage({
  url: MONGO,
  file: async (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          console.log;
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({
  storage,
});

/**
 * Routes
 */

app.post("/upload/image", upload.single("file"), (req, res) => {
  res.json({ file: req.file });
});

app.get("/file/:id", async (req, res) => {
  const { id } = req.params;
  if (!gfs) {
    res.status(400);
  }
  const file = gfs
    .find({
      filename: id,
    })
    .toArray((err, files) => {
      if (!files) {
        res.status(400).send("File not found");
      }
      gfs.openDownloadStreamByName(id).pipe(res);
    });
});

const root = require("path").join(__dirname, "client");
app.use(express.static(root));
app.get("/*", (req, res) => {
  res.sendFile("index.html", { root });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Started server on PORT " + PORT));

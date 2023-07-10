const { randomUUID } = require("node:crypto");
const express = require("express");
const app = express();
const port = 3000;
app.use(express.static("../front-end/dist"));
require("dotenv").config();
require("express-async-errors");
var bodyParser = require("body-parser");
var cors = require("cors");
const { users, LastKnowPosition } = require("./models");

app.use(bodyParser.json());
app.use(cors());
app.post("/syncPosition", async (req, res) => {
  console.log(req.body.line, req.body.userId);
  await LastKnowPosition.findOneAndUpdate(
    { userId: req.body.userId },
    { $set: { line: req.body.line } },
    { upsert: true }
  );
  return res.send([]);
});
app.post("/loadHistory", async (req, res) => {
  const history = await users.aggregate([
    {
      $lookup: {
        from: "lastknowpositions",
        as: "lines",
        foreignField: "userId",
        localField: "_id",
      },
    },
    {
      $project: {
        line: { $first: "$lines.line" },
        userName: 1,
      },
    },
  ]);
  console.log(history);
  res.send(history);
});
app.post("/registerUserName", async (req, res) => {
  let history = [];
  try {
    const user = await users.findOneAndUpdate(
      { userName: req.body.userName },
      {},
      { upsert: true, new: true }
    );

    history = await users.aggregate([
      {
        $match: {
          _id: user._id,
        },
      },
      {
        $lookup: {
          from: "lastknowpositions",
          as: "lines",
          foreignField: "userId",
          localField: "_id",
        },
      },
      {
        $project: {
          line: { $first: "$lines.line" },
          userName: 1,
        },
      },
    ]);
  } catch (error) {}
  res.send(history[0]);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

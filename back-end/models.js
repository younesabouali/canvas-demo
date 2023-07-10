const dbURI = process.env.DB_URI;
console.log(dbURI);
const mongoose = require("mongoose");
mongoose
  .connect(dbURI + "/canvas-test", {
    authSource: "admin",
  })
  .then((res) => console.log("Connected successfully"))
  .catch((err) => console.log("Sommething went wront in connection", err));
const users = mongoose.model("users", { userName: String });
const LastKnowPosition = mongoose.model("lastKnowPositions", {
  userId: mongoose.Types.ObjectId,
  line: {
    from: {
      type: [Number],
    },

    to: {
      type: [Number],
    },
  },
});
module.exports = {
  users,
  LastKnowPosition,
};

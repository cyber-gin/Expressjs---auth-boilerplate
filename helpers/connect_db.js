const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
mongoose.connect(
    `mongodb://ginhinio:Ginhinio12@ac-7mei7g5-shard-00-00.vnicope.mongodb.net:27017,ac-7mei7g5-shard-00-01.vnicope.mongodb.net:27017,ac-7mei7g5-shard-00-02.vnicope.mongodb.net:27017/?ssl=true&replicaSet=atlas-4e049v-shard-0&authSource=admin&retryWrites=true&w=majority`, 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
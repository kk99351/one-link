const mongoose  = require("mongoose");

async function dbconnect() {
    const DB_URL = "mongodb+srv://kk99351:oBJaD8fGzflhkogY@test.mw8pzcr.mongodb.net/?retryWrites=true&w=majority"
    mongoose.connect(
        DB_URL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => {
        console.log("Successfully connected!");
    })
    .catch((error) => {
        console.log("Unable to connect!");
        console.log(error);
    })
}

module.exports = dbconnect;
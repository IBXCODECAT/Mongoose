
const uri = "mongodb+srv://schmitn4:v7HASjSsxELkpgBm@cluster0.hbr5tnv.mongodb.net/?retryWrites=true&w=majority";

import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("MongoDB is Connected...");
  }
  catch(err) {
    console.log(err);
  }
  finally {
    mongoose.connection.close();
  }

}

export default connectDB;
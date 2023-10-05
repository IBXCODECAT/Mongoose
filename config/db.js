import dotenv from 'dotenv';
import mongoose from "mongoose";

// Load env vars
dotenv.config();

// Load Secrets from .env file
const uri = process.env.MONGO_URI;

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
    //mongoose.connection.close();
  }

} 

export default connectDB;
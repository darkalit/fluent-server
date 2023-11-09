import mongoose from "mongoose";

if (!process.env.MONGO_DB_URL) throw new Error("Url to MongoDB is absent");

mongoose.connect(process.env.MONGO_DB_URL);

const db = mongoose.connection;

db.on("error", () => console.log("Error with connecting to db"));
db.once("connected", () => console.log("Success with connecting to db"));

export default db;

import mongoose from "mongoose";
import config from "../../config/config";

const setupTestDB = () => {
  beforeAll(async () => {
    await mongoose.connect(config.mongoose.url);
  });

  afterAll(async () => {
    // await mongoose.disconnect();
  });
};

export default setupTestDB;

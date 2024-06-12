import mongoose from "mongoose";

const dbConnect = async () => {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log(`Connected to mongodb`);
    })
    .catch((err) => {
      console.log(`Error while connecting mongodb ${err}`);
    });
};

export default dbConnect;

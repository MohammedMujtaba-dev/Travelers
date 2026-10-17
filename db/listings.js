import mongoose from "mongoose";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
export const connectDB = async (url) => {
  const connect = await mongoose
    .connect(url)
    .then((res) => {
      console.log("Connection Established");
    })
    .catch((err) => {
      console.log(err);
    });
};

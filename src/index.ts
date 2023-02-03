import { app } from "./app";
import mongoose from "mongoose";

app.listen(6000, () => {
    console.log("App is listening at port 6000");
})
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
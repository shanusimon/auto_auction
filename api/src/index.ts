//DI imports
import "reflect-metadata";

//module imports
import { Server } from "./frameworks/http/server";
import { config } from "./shared/config";
import { MongoConnect } from "./frameworks/database/mongoDB/mongoConnect";

//instance creation
const server = new Server();
const mongoConnect = new MongoConnect();

//database connection
mongoConnect.connectDB();

server.getApp().listen(config.server.PORT,()=>{
    console.log(`Server is running at port ${config.server.PORT}`)
})
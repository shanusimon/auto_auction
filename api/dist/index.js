"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//DI imports
require("reflect-metadata");
//module imports
const server_1 = require("./frameworks/http/server");
const config_1 = require("./shared/config");
const mongoConnect_1 = require("./frameworks/database/mongoDB/mongoConnect");
//instance creation
const server = new server_1.Server();
const mongoConnect = new mongoConnect_1.MongoConnect();
//database connection
mongoConnect.connectDB();
server.getApp().listen(config_1.config.server.PORT, () => {
    console.log(`Server is running at port ${config_1.config.server.PORT}`);
});

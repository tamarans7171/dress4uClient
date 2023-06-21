
const indexR = require("./index");
const userR = require("./users");

exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",userR);
}
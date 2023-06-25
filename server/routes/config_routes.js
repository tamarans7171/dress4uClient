const indexR = require("./index");
const userR = require("./userRoute");
const areaR = require("./areaRoute");
const colorR = require("./colorRoute");
const dressR = require("./dressRoute");
const imagesR = require("./imagesRoute");
const commentR = require("./commentRoute");
const paymentR = require("./paymentRoute");
const perferenceR = require("./perferenceRoute");
const styleR = require("./styleRoute");
const subAreaR = require("./subAreaRoute");

exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",userR);
  app.use("/areas",areaR);
  app.use("/colors",colorR);
  app.use("/comments",commentR);
  app.use("/dresses",dressR);
  app.use("/images",imagesR);
  app.use("/payments",paymentR);
  app.use("/perferences",perferenceR);
  app.use("/styles",styleR);
  app.use("/subAreas",subAreaR);
}
import path from "path";
import express from "express";
import bodyParser from "body-parser";

import routers from "./routers";

const AUTH_NAME = "zds";

const app = express();

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "../huali-ui")));

app.use("/", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "content-type,auth-name");

  const { headers } = req;

  next();

  // // TODO: 加个密码测试下，以后用数据库来保存密码;
  // if (headers["auth-name"] === AUTH_NAME) {
  //   next();
  // } else {
  //   res.send(403, "没有权限");
  // }
});

app.use("/api", routers);

app.listen(8080);

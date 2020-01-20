import express from "express";
import { create } from "./utils";

const router = express.Router();

router.get("/test", (request, response) => {
  response.send("123");
});

router.post("/archive/create", (request, response) => {
  const body = request.body;

  create(body).then(
    res => {
      console.log(res, "success");
      response.send(`创建成功：总共 ${res.length} 个文件！`);
    },
    err => {
      console.log(err, "error");
      response.send(500, "创建失败");
    }
  );
});

export default router;

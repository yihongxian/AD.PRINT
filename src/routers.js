import express from "express";
import compressing from 'compressing';

import { merge, create } from "./utils";

const router = express.Router();

router.post("/config/merge", (request, response) => {
  console.log(request.body);
  const { catalogs, categories } = request.body;
  const result = {};
  if (catalogs) {
    result.catalogs = merge.mergeCatalog(catalogs);
  }

  if (categories) {
    result.categories = merge.mergeCategory(categories);
  }

  response.send(result);
});

router.post("/file/create", (request, response) => {
  const body = request.body;
  console.log(body)

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

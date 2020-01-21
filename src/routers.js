import fs from "fs";
import path from "path";
import express from "express";

import { config, create } from "./utils";

const router = express.Router();

// 合并服务器与浏览器的配置并返回
router.post("/config/merge", (request, response) => {
  const { catalogs = [], categories = [] } = request.body;
  const {
    catalogPath,
    categoryPath,
    getFileData,
    saveFileData,
    mergeFileData
  } = config;
  try {
    const oldCatalogs = getFileData(catalogPath);
    const oldCategories = getFileData(categoryPath);

    const mergeCatalogs = mergeFileData(oldCatalogs, catalogs);
    const mergeCategories = mergeFileData(oldCategories, categories);

    saveFileData(catalogPath, mergeCatalogs);
    saveFileData(categoryPath, mergeCategories);

    response.send({ catalogs: mergeCatalogs, categories: mergeCategories });
  } catch (error) {
    response.send(500, "合并失败");
  }
});

// 使用浏览器配置覆盖服务器配置
router.post("/config/cover", (request, response) => {
  const { catalogs = [], categories = [] } = request.body;
  const { catalogPath, categoryPath, saveFileData } = config;

  try {
    saveFileData(catalogPath, catalogs);
    saveFileData(categoryPath, categories);
    response.send("覆盖完成");
  } catch (error) {
    response.send(500, "覆盖失败");
  }
});

// 获取服务器的配置
router.post("/config/query", (request, response) => {
  const { catalogPath, categoryPath, getFileData } = config;

  try {
    const catalogs = getFileData(catalogPath);
    const categories = getFileData(categoryPath);

    response.send({ catalogs, categories });
  } catch (error) {
    response.send(500, "获取失败");
  }
});

router.post("/file/create", (request, response) => {
  const body = request.body;

  const timeStramp = Date.now();

  const zipName = `${timeStramp}.zip`;

  const targets = {
    file: path.resolve(process.cwd(), `outputs/${timeStramp}`),
    zip: path.resolve(process.cwd(), `zips/${zipName}`)
  };

  create(body, targets).then(
    res => {
      try {
        const zipStats = fs.statSync(targets.zip);

        response.header("Access-Control-Expose-Headers", "Content-Disposition");
        response.set({
          "Content-type": "application/octet-stream",
          "Content-Disposition": "attachment;filename=" + encodeURI(zipName),
          "Content-Length": zipStats.size
        });
        let fReadStream = fs.createReadStream(targets.zip);
        fReadStream.pipe(response);
      } catch (error) {
        response.send(500, error);
      }
    },
    err => {
      response.send(500, err);
    }
  );
});

export default router;

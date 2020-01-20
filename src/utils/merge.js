import fs from "fs";
import path from "path";

function getFileData(src) {
  const file = fs.readFileSync(path.join(__dirname, src), "utf-8");
  try {
    return JSON.parse(file);
  } catch (e) {
    return [];
  }
}

function mergeFileData(oldData, newData) {
  const ids = [];
  const results = [];
  [...oldData, ...newData].forEach(item => {
    if (!item.id) {
      return;
    }
    const index = ids.indexOf(item.id);
    if (index >= 0) {
      results.splice(index, 1, item);
    } else {
      ids.push(item.id);
      results.push(item);
    }
  });
  return results;
}

function saveFileData(src, data) {
  fs.writeFileSync(path.join(__dirname, src), JSON.stringify(data));
}

function mergeCatalog(catalogs = []) {
  const src = "../configs/catalogs.json";
  const baseData = getFileData(src);
  const currentData = mergeFileData(baseData, catalogs);
  saveFileData(src, currentData);
  return currentData;
}

function mergeCategory(categories = []) {
  const src = "../configs/category.json";
  const baseData = getFileData(src);
  const currentData = mergeFileData(baseData, categories);
  saveFileData(src, currentData);
  return currentData;
}

export default {
  mergeCatalog,
  mergeCategory
};

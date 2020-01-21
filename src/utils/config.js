import fs from "fs";
import path from "path";

const catalogPath = path.resolve(process.cwd(), "configs/catalogs.json");
const categoryPath = path.resolve(process.cwd(), "configs/categories.json");

function getFileData(src) {
  const file = fs.readFileSync(src, "utf-8");
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
  fs.writeFileSync(src, JSON.stringify(data));
}

export default {
  catalogPath,
  categoryPath,
  getFileData,
  mergeFileData,
  saveFileData
};

import _ from "lodash";
import path from "path";
import dayjs from "dayjs";
import compressing from "compressing";
import docTemplates from "docx-templates";

const PAGE_NUMBER_WIDTH = 3;
const CATALOG_MAX_LENGTH = 15;

const DATE_FORMAT = "YYYY年MM月";
const DATETIME_FORMAT = "YYYY.MM.DD";

function transformCovers(covers) {
  if (covers[1]) {
    return `${covers[0]}(${covers[1]})`;
  } else {
    return covers[0];
  }
}

function transformFileData({ time, catalogs, ...data }) {
  const applyTime = dayjs(time);
  const startSaveTimeFormat = applyTime.format(DATE_FORMAT);
  const endSaveTimeFormat = applyTime.add(30, "year").format(DATE_FORMAT);
  const checkTimeFormat = applyTime.add(3, "month").format(DATETIME_FORMAT);

  data.check_time = checkTimeFormat;
  data.section = `自${startSaveTimeFormat}至${endSaveTimeFormat}`;
  data.catalogs = _.times(CATALOG_MAX_LENGTH, function(index) {
    const item = catalogs[index];
    if (item) {
      item.sort = index + 1;
      item.pn = _.padStart(item.pn, PAGE_NUMBER_WIDTH, "0");
      return item;
    } else {
      return {};
    }
  });
  return data;
}

export default (files, targets) => {
  const indexs = {};
  return new Promise((resolve, reject) => {
    Promise.all(
      files.slice(0,312).map((item, index) => {
        const data = transformFileData(item);
        indexs[data.title] = indexs[data.title] || 0;
        indexs[data.title] += 1;
        const fileName = transformCovers(data.covers);
        return docTemplates({
          cmdDelimiter: ["{", "}"],
          template: path.resolve(process.cwd(), "template/index.docx"),
          output: path.resolve(
            targets.file,
            `${data.title}/${indexs[data.title]}.${fileName}.docx`
          ),
          data
        });
      })
    )
      .then(res => {
        compressing.zip
          .compressDir(targets.file, targets.zip)
          .then(() => {
            resolve(res);
          })
          .catch(() => {
            reject("压缩失败");
          });
      })
      .catch(() => {
        reject("创建失败");
      });
  });
};

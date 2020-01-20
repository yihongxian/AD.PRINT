import _ from "lodash";
import dayjs from "dayjs";
import path from "path";
import docTemplates from "docx-templates";

const PAGE_NUMBER_WIDTH = 3;
const CATALOG_MAX_LENGTH = 16;

const Types = {
  // 医疗机构执业审批
  medical: "medical"
};

const DATE_FORMAT = "YYYY年MM月";
const DATETIME_FORMAT = "YYYY.MM.DD";

function transformCovers(covers) {
  if (covers[1]) {
    return `${covers[0]}(${covers[1]})`;
  } else {
    return covers[0];
  }
}

function createTemplate(config) {
  return docTemplates({
    cmdDelimiter: ["{", "}"],
    template: path.resolve(process.cwd(), "template/index.docx"),
    output: path.resolve(
      process.cwd(),
      `outputs/${config.title}/${transformCovers(config.covers)}.docx`
    ),
    data: config
  });
}

export default files =>
  Promise.all(
    files.map(({ time, catalogs, ...data }) => {
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

      return createTemplate(data);
    })
  );

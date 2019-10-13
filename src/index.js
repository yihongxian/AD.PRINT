import _ from "lodash";
import dayjs from "dayjs";
import path from "path";
import docTemplates from "docx-templates";

import medicals from "../datas/medicals.json";

const PAGE_NUMBER_WIDTH = 3;
const CATALOG_MAX_LENGTH = 16;

const Types = {
  // 医疗机构执业审批
  medical: "medical"
};

const DATE_FORMAT = "YYYY年MM月";
const DATETIME_FORMAT = "YYYY.MM.DD";

medicals.forEach(({ time, user, address, catalogs, ...data }) => {
  const applyTime = dayjs(time);
  const startSaveTimeFormat = applyTime.format(DATE_FORMAT);
  const endSaveTimeFormat = applyTime.add(30, "year").format(DATE_FORMAT);
  const checkTimeFormat = applyTime.add(3, "month").format(DATETIME_FORMAT);

  data.content = [];
  user && data.content.push(user);
  address && data.content.push(address);

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

  createDocByTemplate(data, Types.medical);
});

function createDocByTemplate(config, type) {
  docTemplates({
    cmdDelimiter: ["{", "}"],
    template: path.resolve(__dirname, `../template/index.docx`),
    output: path.resolve(
      __dirname,
      `../outputs/${type}/${config.content[0]}.docx`
    ),
    data: config
  })
    .then(success => {
      console.log(success);
    })
    .catch(err => {
      console.log(err);
    });
}

# ArchivesArrangeBack(档案整理后台)

根据页面输入生成 docx 文档

## 数据结构

### 输入数据

| 字段名   | 数据类型       | 描述           |
| -------- | -------------- | -------------- |
| title    | String         | 文件名称       |
| user     | String         | 申请人         |
| address  | String         | 地址           |
| time     | Int            | 创建申请时间戳 |
| creater  | String         | 立卷人         |
| checker  | String         | 检查人         |
| catalogs | Array<Catalog> | 目录           |

### Catalog

| 字段名       | 数据类型 | 描述   |
| ------------ | -------- | ------ |
| catalog.sort | Int      | 序号   |
| catalog.name | String   | 目录名 |
| catalog.pn   | Int      | 页号   |

### 输出数据

| 字段名     | 数据类型       | 描述                                           |
| ---------- | -------------- | ---------------------------------------------- |
| title      | String         | 文件封面名称                                   |
| contents   | Array<Sting>   | 文件封面内容                                   |
| section    | String         | 有效期区间。根据 time 和 duration 计算         |
| creater    | String         | 立卷人                                         |
| checker    | String         | 检查人                                         |
| check_time | String         | 检查时间。根据 time 计算，基本比 time 晚三个月 |
| catalogs   | Array<Catalog> | 目录                                           |

### 数据配置

| 字段名     | 数据类型 | 描述                |
| ---------- | -------- | ------------------- |
| department | String   | 部门                |
| duration   | Int      | 保管期限 default:30 |

## 项目启动

### 开发环境中使用npm start

script.start 使用 babel-watch 监听 src 并启动服务器。
当 src 目录下的文件变化时，对 express 服务器进行热重启

### 生产环境中 npm run release



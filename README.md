# ArchivesArrangeBack(档案整理后台)

根据页面输入生成docx文档

## 数据结构

### 输入数据
--- title       {String}            // 文件名称 
--- user        {String}            // 申请人
--- address     {String}            // 地址
--- time        {Int}               // 创建申请时间戳
--- creater     {String}            // 立卷人
--- checker     {String}            // 检查人
--- catalogs    {Array<Catalog>}    // 目录

### Catalog
--- catalog.sort  {Int}             // 序号
--- catalog.name  {String}          // 目录名
--- catalog.pn    {Int}             // 页号

### 输出数据
--- title       {String}            // 文件封面名称 
--- contents    {Array<Sting>}      // 文件封面内容
--- section     {String}            // 有效期区间。根据time和duration计算
--- creater     {String}            // 立卷人
--- checker     {String}            // 检查人
--- check_time  {String}            // 检查时间。根据time计算，基本比time晚三个月
--- catalogs    {Array<Catalog>}    // 目录


### 数据配置
--- department  {String}            // 部门
--- duration    {Int}               // 保管期限 default:30

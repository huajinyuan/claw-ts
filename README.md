# Vue + Node.js + Fabric.js 设计器

这是一个类似 sdsdiy.com 的在线设计器，支持拖拽、编辑、保存和导出设计。

## 技术栈
- **前端**: Vue 3 + Vuex + Vue Router + Fabric.js
- **后端**: Node.js + Express + MongoDB
- **功能**: 拖拽素材、文本编辑、图片上传、图层管理、属性调整、设计保存

## 项目结构
```
designer-project/
├── src/                    # 前端源码
│   ├── components/         # Vue组件
│   │   ├── Designer.vue    # 主设计器组件
│   │   ├── AssetLibrary.vue # 素材库
│   │   ├── PropertyPanel.vue # 属性面板
│   │   └── Toolbar.vue     # 工具栏
│   ├── store/              # Vuex状态管理
│   ├── router/             # 路由配置
│   ├── services/           # API服务
│   ├── utils/              # 工具函数
│   └── main.js             # 入口文件
├── server/                 # 后端服务
│   ├── routes/             # API路由
│   ├── models/             # 数据模型
│   ├── middleware/         # 中间件
│   └── server.js           # 服务器入口
├── package.json            # 项目根配置
└── vue.config.js           # Vue配置
```

## 安装和运行

### 1. 安装依赖
```bash
# 安装前端依赖
cd designer-project
npm install

# 安装后端依赖
cd server
npm install
```

### 2. 配置环境
创建 `.env` 文件在项目根目录：
```env
MONGODB_URI=mongodb://localhost:27017/designer
PORT=3000
```

### 3. 启动服务
```bash
# 启动后端 (在server目录)
npm start

# 启动前端 (在项目根目录)
npm run serve
```

## 功能特性

### 前端功能
- **拖拽添加元素**: 从素材库拖拽文本、图片、形状到画布
- **Fabric.js 画布**: 支持缩放、旋转、移动、对齐等操作
- **属性面板**: 实时调整选中元素的属性
- **图层管理**: 显示所有元素，支持上下移动、删除
- **设计保存**: 保存到本地或服务器
- **导出功能**: 导出为PNG、JPG或JSON

### 后端API
- `POST /api/designs` - 保存设计
- `GET /api/designs/:id` - 获取设计
- `POST /api/upload` - 上传图片
- `GET /api/assets` - 获取素材库

## 自定义扩展

### 添加新素材类型
1. 在 `AssetLibrary.vue` 中添加新的素材类别
2. 在 `Designer.vue` 的 `addElement` 方法中处理新类型
3. 在 `PropertyPanel.vue` 中添加对应的属性编辑器

### 扩展属性面板
修改 `PropertyPanel.vue` 组件，根据选中元素类型显示不同的属性选项。

## 注意事项
- 需要安装 MongoDB 或使用 MongoDB Atlas
- 图片上传功能需要配置存储路径
- 生产环境需要配置 HTTPS 和适当的错误处理

## 参考
- [Fabric.js 官方文档](http://fabricjs.com/)
- [Vue 3 官方文档](https://vuejs.org/)
- [Express.js 官方文档](https://expressjs.com/)
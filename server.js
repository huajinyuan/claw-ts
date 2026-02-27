const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// 配置CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// 解析JSON
app.use(express.json());

// 静态文件服务
app.use('/uploads', express.static('uploads'));

// 确保上传目录存在
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// 配置multer用于文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB限制
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  }
});

// 保存设计数据的API
app.post('/api/save-design', (req, res) => {
  try {
    const { designData, designId } = req.body;
    
    // 确保designs目录存在
    if (!fs.existsSync('designs')) {
      fs.mkdirSync('designs');
    }
    
    const filename = designId ? `design-${designId}.json` : `design-${Date.now()}.json`;
    const filepath = path.join('designs', filename);
    
    fs.writeFileSync(filepath, JSON.stringify(designData, null, 2));
    
    res.json({
      success: true,
      message: '设计保存成功',
      designId: filename.replace('design-', '').replace('.json', '')
    });
  } catch (error) {
    console.error('保存设计失败:', error);
    res.status(500).json({
      success: false,
      message: '保存设计失败'
    });
  }
});

// 加载设计数据的API
app.get('/api/load-design/:designId', (req, res) => {
  try {
    const { designId } = req.params;
    const filepath = path.join('designs', `design-${designId}.json`);
    
    if (fs.existsSync(filepath)) {
      const designData = fs.readFileSync(filepath, 'utf8');
      res.json({
        success: true,
        data: JSON.parse(designData)
      });
    } else {
      res.status(404).json({
        success: false,
        message: '设计未找到'
      });
    }
  } catch (error) {
    console.error('加载设计失败:', error);
    res.status(500).json({
      success: false,
      message: '加载设计失败'
    });
  }
});

// 图片上传API
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '没有上传文件'
      });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: imageUrl,
      message: '图片上传成功'
    });
  } catch (error) {
    console.error('图片上传失败:', error);
    res.status(500).json({
      success: false,
      message: '图片上传失败'
    });
  }
});

// 获取素材库
app.get('/api/materials', (req, res) => {
  const materials = {
    shapes: [
      { id: 'rect', name: '矩形', type: 'rect' },
      { id: 'circle', name: '圆形', type: 'circle' },
      { id: 'triangle', name: '三角形', type: 'triangle' },
      { id: 'line', name: '直线', type: 'line' }
    ],
    textTemplates: [
      { id: 'title', name: '标题', content: '点击编辑标题' },
      { id: 'subtitle', name: '副标题', content: '点击编辑副标题' },
      { id: 'body', name: '正文', content: '点击编辑正文内容' }
    ],
    images: [
      // 这里可以添加默认图片或从uploads目录读取
    ]
  };
  
  res.json({
    success: true,
    data: materials
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`设计器后端服务运行在 http://localhost:${PORT}`);
});
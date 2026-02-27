const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

// 获取素材库数据
router.get('/assets', async (req, res) => {
  try {
    // 模拟素材数据
    const assets = {
      text: [
        { id: 'text1', name: '标题文本', type: 'text', content: '双击编辑文字' },
        { id: 'text2', name: '副标题', type: 'text', content: '副标题文字' },
        { id: 'text3', name: '正文', type: 'text', content: '这是一段正文内容...' }
      ],
      images: [
        { id: 'img1', name: '背景图1', type: 'image', url: '/assets/images/bg1.jpg' },
        { id: 'img2', name: '装饰图1', type: 'image', url: '/assets/images/decor1.png' },
        { id: 'img3', name: 'Logo', type: 'image', url: '/assets/images/logo.png' }
      ],
      shapes: [
        { id: 'rect1', name: '矩形', type: 'rect', width: 100, height: 100, fill: '#ff6b6b' },
        { id: 'circle1', name: '圆形', type: 'circle', radius: 50, fill: '#4ecdc4' },
        { id: 'triangle1', name: '三角形', type: 'triangle', width: 100, height: 100, fill: '#45b7d1' }
      ]
    };
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 保存设计
router.post('/save', async (req, res) => {
  try {
    const { designData, userId } = req.body;
    const timestamp = Date.now();
    const filename = `design_${userId}_${timestamp}.json`;
    const filepath = path.join(__dirname, '../saved-designs', filename);
    
    // 确保目录存在
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    
    // 保存设计数据
    await fs.writeFile(filepath, JSON.stringify(designData, null, 2));
    
    res.json({ success: true, filename, message: '设计保存成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取已保存的设计
router.get('/designs/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const designsDir = path.join(__dirname, '../saved-designs');
    const files = await fs.readdir(designsDir);
    const userDesigns = files
      .filter(file => file.startsWith(`design_${userId}_`))
      .map(file => ({
        filename: file,
        timestamp: file.split('_')[2].replace('.json', '')
      }));
    
    res.json(userDesigns);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.json([]);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// 加载特定设计
router.get('/load/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(__dirname, '../saved-designs', filename);
    const data = await fs.readFile(filepath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(404).json({ error: '设计文件未找到' });
  }
});

module.exports = router;
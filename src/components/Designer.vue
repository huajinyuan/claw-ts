<template>
  <div class="designer-container">
    <!-- 左侧素材库 -->
    <div class="sidebar left-sidebar">
      <h3>素材库</h3>
      <div class="materials">
        <div class="material-item" draggable="true" @dragstart="onDragStart('text')">
          <span>📝 文本</span>
        </div>
        <div class="material-item" draggable="true" @dragstart="onDragStart('image')">
          <span>🖼️ 图片</span>
        </div>
        <div class="material-item" draggable="true" @dragstart="onDragStart('rectangle')">
          <span>▭ 矩形</span>
        </div>
        <div class="material-item" draggable="true" @dragstart="onDragStart('circle')">
          <span>⭕ 圆形</span>
        </div>
      </div>
    </div>

    <!-- 中间画布区域 -->
    <div class="canvas-container">
      <div 
        ref="canvasContainer" 
        class="fabric-canvas"
        @drop="onDrop"
        @dragover="onDragOver"
      ></div>
      
      <!-- 工具栏 -->
      <div class="toolbar">
        <button @click="undo">↩️ 撤销</button>
        <button @click="redo">↪️ 重做</button>
        <button @click="clearCanvas">🗑️ 清空</button>
        <button @click="saveDesign">💾 保存</button>
      </div>
    </div>

    <!-- 右侧属性面板 -->
    <div class="sidebar right-sidebar">
      <h3>属性</h3>
      <div v-if="selectedObject" class="properties">
        <div class="property-group">
          <label>位置</label>
          <input type="number" v-model="selectedObject.left" @change="updateObject" placeholder="X">
          <input type="number" v-model="selectedObject.top" @change="updateObject" placeholder="Y">
        </div>
        <div class="property-group">
          <label>尺寸</label>
          <input type="number" v-model="selectedObject.width" @change="updateObject" placeholder="宽">
          <input type="number" v-model="selectedObject.height" @change="updateObject" placeholder="高">
        </div>
        <div class="property-group" v-if="selectedObject.type === 'text'">
          <label>文本内容</label>
          <textarea v-model="selectedObject.text" @change="updateObject"></textarea>
        </div>
        <div class="property-group">
          <label>颜色</label>
          <input type="color" v-model="selectedObject.fill" @change="updateObject">
        </div>
      </div>
      <div v-else class="no-selection">
        <p>请选择一个对象</p>
      </div>
    </div>
  </div>
</template>

<script>
import { fabric } from 'fabric';
import axios from 'axios';

export default {
  name: 'Designer',
  data() {
    return {
      canvas: null,
      selectedObject: null,
      history: [],
      historyStep: -1,
      currentMaterial: null
    };
  },
  mounted() {
    this.initCanvas();
  },
  methods: {
    initCanvas() {
      const container = this.$refs.canvasContainer;
      this.canvas = new fabric.Canvas(container, {
        width: 800,
        height: 600,
        backgroundColor: '#f5f5f5'
      });

      // 监听选择事件
      this.canvas.on('selection:created', this.onSelection);
      this.canvas.on('selection:updated', this.onSelection);
      this.canvas.on('selection:cleared', this.onSelectionCleared);
    },

    onDragStart(type) {
      this.currentMaterial = type;
    },

    onDragOver(e) {
      e.preventDefault();
    },

    onDrop(e) {
      e.preventDefault();
      if (!this.currentMaterial) return;

      const rect = this.$refs.canvasContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this.createObject(this.currentMaterial, x, y);
      this.currentMaterial = null;
    },

    createObject(type, x, y) {
      let obj;
      const commonProps = {
        left: x,
        top: y,
        selectable: true,
        hasControls: true
      };

      switch (type) {
        case 'text':
          obj = new fabric.Text('双击编辑', {
            ...commonProps,
            fontSize: 20,
            fill: '#000000'
          });
          break;
        case 'image':
          // 这里可以添加默认图片或提示用户上传
          obj = new fabric.Rect({
            ...commonProps,
            width: 100,
            height: 100,
            fill: '#cccccc',
            stroke: '#999999'
          });
          break;
        case 'rectangle':
          obj = new fabric.Rect({
            ...commonProps,
            width: 100,
            height: 60,
            fill: '#4CAF50',
            stroke: '#388E3C'
          });
          break;
        case 'circle':
          obj = new fabric.Circle({
            ...commonProps,
            radius: 50,
            fill: '#2196F3',
            stroke: '#1976D2'
          });
          break;
      }

      if (obj) {
        this.canvas.add(obj);
        this.saveToHistory();
        this.canvas.setActiveObject(obj);
      }
    },

    onSelection() {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject) {
        this.selectedObject = {
          id: activeObject.id || Date.now(),
          type: activeObject.type,
          left: Math.round(activeObject.left),
          top: Math.round(activeObject.top),
          width: Math.round(activeObject.width),
          height: Math.round(activeObject.height),
          fill: activeObject.fill,
          text: activeObject.text || ''
        };
      }
    },

    onSelectionCleared() {
      this.selectedObject = null;
    },

    updateObject() {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject && this.selectedObject) {
        activeObject.set({
          left: this.selectedObject.left,
          top: this.selectedObject.top,
          fill: this.selectedObject.fill
        });

        if (activeObject.type === 'text') {
          activeObject.set({ text: this.selectedObject.text });
        }

        // 更新尺寸（需要特殊处理）
        if (this.selectedObject.width && this.selectedObject.height) {
          activeObject.set({
            scaleX: this.selectedObject.width / activeObject.width,
            scaleY: this.selectedObject.height / activeObject.height
          });
        }

        this.canvas.renderAll();
        this.saveToHistory();
      }
    },

    saveToHistory() {
      // 限制历史记录长度
      if (this.historyStep < this.history.length - 1) {
        this.history = this.history.slice(0, this.historyStep + 1);
      }
      
      this.history.push(JSON.stringify(this.canvas.toJSON()));
      this.historyStep = this.history.length - 1;
      
      // 限制历史记录数量
      if (this.history.length > 50) {
        this.history.shift();
        this.historyStep--;
      }
    },

    undo() {
      if (this.historyStep > 0) {
        this.historyStep--;
        this.loadFromHistory();
      }
    },

    redo() {
      if (this.historyStep < this.history.length - 1) {
        this.historyStep++;
        this.loadFromHistory();
      }
    },

    loadFromHistory() {
      if (this.history[this.historyStep]) {
        this.canvas.clear();
        this.canvas.loadFromJSON(this.history[this.historyStep], () => {
          this.canvas.renderAll();
          this.onSelectionCleared();
        });
      }
    },

    clearCanvas() {
      if (confirm('确定要清空画布吗？')) {
        this.canvas.clear();
        this.selectedObject = null;
        this.history = [];
        this.historyStep = -1;
      }
    },

    async saveDesign() {
      try {
        const designData = this.canvas.toJSON();
        const response = await axios.post('/api/save-design', {
          design: designData,
          timestamp: new Date().toISOString()
        });
        
        alert('设计已保存！ID: ' + response.data.id);
      } catch (error) {
        console.error('保存失败:', error);
        alert('保存失败，请检查网络连接');
      }
    }
  }
};
</script>

<style scoped>
.designer-container {
  display: flex;
  height: 100vh;
  background: #ffffff;
}

.sidebar {
  width: 200px;
  padding: 16px;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
}

.left-sidebar {
  background: #f9f9f9;
}

.right-sidebar {
  background: #fafafa;
}

.materials {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.material-item {
  padding: 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: grab;
  user-select: none;
  transition: all 0.2s;
}

.material-item:hover {
  background: #e8f4fd;
  transform: translateY(-2px);
}

.canvas-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.fabric-canvas {
  flex: 1;
  border: 1px solid #ccc;
  margin: 16px;
  background: white;
  overflow: hidden;
}

.toolbar {
  padding: 12px;
  background: #f5f5f5;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 8px;
}

.toolbar button {
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.toolbar button:hover {
  background: #45a049;
}

.properties {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.property-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.property-group label {
  font-weight: bold;
  font-size: 14px;
}

.property-group input,
.property-group textarea {
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.property-group textarea {
  min-height: 60px;
  resize: vertical;
}

.no-selection {
  padding: 20px;
  color: #666;
  text-align: center;
}

h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
}
</style>
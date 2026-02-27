<template>
  <div class="toolbar">
    <div class="tool-group">
      <button @click="selectTool('select')" :class="{ active: currentTool === 'select' }">
        <i class="icon">↖</i> 选择
      </button>
      <button @click="selectTool('text')" :class="{ active: currentTool === 'text' }">
        <i class="icon">T</i> 文本
      </button>
      <button @click="selectTool('image')" :class="{ active: currentTool === 'image' }">
        <i class="icon">🖼️</i> 图片
      </button>
      <button @click="selectTool('shape')" :class="{ active: currentTool === 'shape' }">
        <i class="icon">□</i> 形状
      </button>
    </div>
    
    <div class="tool-group">
      <button @click="undo" title="撤销 (Ctrl+Z)">
        <i class="icon">↩</i> 撤销
      </button>
      <button @click="redo" title="重做 (Ctrl+Y)">
        <i class="icon">↪</i> 重做
      </button>
      <button @click="download" title="下载设计">
        <i class="icon">💾</i> 下载
      </button>
      <button @click="save" title="保存设计">
        <i class="icon">⭐</i> 保存
      </button>
    </div>
    
    <div class="tool-group">
      <button @click="zoomIn" title="放大">
        <i class="icon">+</i>
      </button>
      <span class="zoom-level">{{ Math.round(zoom * 100) }}%</span>
      <button @click="zoomOut" title="缩小">
        <i class="icon">-</i>
      </button>
      <button @click="resetZoom" title="重置缩放">
        <i class="icon">↺</i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Toolbar',
  props: {
    currentTool: String,
    zoom: Number
  },
  emits: ['select-tool', 'undo', 'redo', 'download', 'save', 'zoom-in', 'zoom-out', 'reset-zoom'],
  methods: {
    selectTool(tool) {
      this.$emit('select-tool', tool);
    },
    undo() {
      this.$emit('undo');
    },
    redo() {
      this.$emit('redo');
    },
    download() {
      this.$emit('download');
    },
    save() {
      this.$emit('save');
    },
    zoomIn() {
      this.$emit('zoom-in');
    },
    zoomOut() {
      this.$emit('zoom-out');
    },
    resetZoom() {
      this.$emit('reset-zoom');
    }
  }
};
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 20px;
  padding: 12px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  flex-wrap: wrap;
}

.tool-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

button {
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

button:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

button.active:hover {
  background: #0069d9;
  border-color: #0062cc;
}

.icon {
  margin-right: 4px;
  font-weight: bold;
}

.zoom-level {
  min-width: 40px;
  text-align: center;
  font-weight: bold;
  color: #495057;
}
</style>
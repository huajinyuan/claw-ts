<template>
  <div class="property-panel">
    <h3>属性面板</h3>
    <div v-if="selectedObject" class="object-properties">
      <div class="property-group">
        <h4>基础属性</h4>
        <div class="property-item">
          <label>类型:</label>
          <span>{{ selectedObject.type }}</span>
        </div>
        <div class="property-item">
          <label>X:</label>
          <input 
            type="number" 
            v-model.number="selectedObject.left" 
            @change="updateObject"
          />
        </div>
        <div class="property-item">
          <label>Y:</label>
          <input 
            type="number" 
            v-model.number="selectedObject.top" 
            @change="updateObject"
          />
        </div>
        <div class="property-item">
          <label>宽度:</label>
          <input 
            type="number" 
            v-model.number="selectedObject.width" 
            @change="updateObject"
          />
        </div>
        <div class="property-item">
          <label>高度:</label>
          <input 
            type="number" 
            v-model.number="selectedObject.height" 
            @change="updateObject"
          />
        </div>
      </div>

      <div class="property-group" v-if="selectedObject.type === 'text'">
        <h4>文本属性</h4>
        <div class="property-item">
          <label>内容:</label>
          <textarea 
            v-model="selectedObject.text" 
            @change="updateObject"
          ></textarea>
        </div>
        <div class="property-item">
          <label>字体大小:</label>
          <input 
            type="number" 
            v-model.number="selectedObject.fontSize" 
            @change="updateObject"
          />
        </div>
        <div class="property-item">
          <label>颜色:</label>
          <input 
            type="color" 
            v-model="selectedObject.fill" 
            @change="updateObject"
          />
        </div>
      </div>

      <div class="property-group" v-if="selectedObject.type === 'image'">
        <h4>图片属性</h4>
        <div class="property-item">
          <label>透明度:</label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            v-model.number="selectedObject.opacity" 
            @change="updateObject"
          />
          <span>{{ selectedObject.opacity }}</span>
        </div>
      </div>

      <div class="property-group">
        <h4>操作</h4>
        <button @click="deleteObject">删除</button>
        <button @click="duplicateObject">复制</button>
      </div>
    </div>
    <div v-else>
      <p>请选择一个对象</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PropertyPanel',
  props: {
    selectedObject: Object,
    canvas: Object
  },
  methods: {
    updateObject() {
      if (this.canvas && this.selectedObject) {
        this.canvas.renderAll();
        this.$emit('object-updated', this.selectedObject);
      }
    },
    deleteObject() {
      if (this.canvas && this.selectedObject) {
        this.canvas.remove(this.selectedObject);
        this.$emit('object-deleted');
      }
    },
    duplicateObject() {
      if (this.canvas && this.selectedObject) {
        const cloned = this.selectedObject.clone();
        cloned.set({
          left: this.selectedObject.left + 20,
          top: this.selectedObject.top + 20
        });
        this.canvas.add(cloned);
        this.canvas.setActiveObject(cloned);
        this.$emit('object-added', cloned);
      }
    }
  }
}
</script>

<style scoped>
.property-panel {
  width: 250px;
  height: 100%;
  background: #f5f5f5;
  padding: 16px;
  border-left: 1px solid #ddd;
  overflow-y: auto;
}

.property-panel h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #333;
}

.object-properties {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.property-group {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  background: white;
}

.property-group h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
}

.property-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
}

.property-item label {
  width: 80px;
  font-size: 12px;
  color: #666;
}

.property-item input,
.property-item textarea {
  flex: 1;
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 12px;
}

.property-item input[type="color"] {
  width: 40px;
  height: 24px;
  padding: 0;
}

.property-item input[type="range"] {
  flex: 1;
}

.property-item button {
  width: 100%;
  padding: 6px 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.property-item button:hover {
  background: #0056b3;
}

.property-item button:nth-child(2) {
  background: #28a745;
}

.property-item button:nth-child(2):hover {
  background: #1e7e34;
}
</style>
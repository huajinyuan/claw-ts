<template>
  <div class="layer-panel">
    <h3>图层</h3>
    <div class="layers-list">
      <div 
        v-for="(layer, index) in layers" 
        :key="index"
        class="layer-item"
        :class="{ active: layer.id === activeLayerId }"
        @click="selectLayer(layer.id)"
      >
        <span class="layer-name">{{ layer.name || `图层 ${index + 1}` }}</span>
        <span class="layer-type">{{ layer.type }}</span>
        <button 
          class="layer-visibility"
          @click.stop="toggleVisibility(layer.id)"
        >
          {{ layer.visible ? '👁️' : '🙈' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LayerPanel',
  props: {
    canvas: Object,
    activeLayerId: String
  },
  data() {
    return {
      layers: []
    };
  },
  mounted() {
    this.updateLayers();
    this.canvas.on('object:added', this.updateLayers);
    this.canvas.on('object:removed', this.updateLayers);
    this.canvas.on('selection:created', this.handleSelection);
    this.canvas.on('selection:updated', this.handleSelection);
    this.canvas.on('selection:cleared', () => {
      this.$emit('update:activeLayerId', null);
    });
  },
  beforeUnmount() {
    this.canvas.off('object:added', this.updateLayers);
    this.canvas.off('object:removed', this.updateLayers);
    this.canvas.off('selection:created', this.handleSelection);
    this.canvas.off('selection:updated', this.handleSelection);
    this.canvas.off('selection:cleared');
  },
  methods: {
    updateLayers() {
      this.layers = this.canvas.getObjects().map(obj => ({
        id: obj.id || obj.__id,
        name: obj.name || obj.type,
        type: obj.type,
        visible: obj.visible !== false
      }));
    },
    handleSelection() {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject) {
        this.$emit('update:activeLayerId', activeObject.id || activeObject.__id);
      }
    },
    selectLayer(layerId) {
      const targetObject = this.canvas.getObjects().find(obj => 
        (obj.id || obj.__id) === layerId
      );
      if (targetObject) {
        this.canvas.setActiveObject(targetObject);
        this.canvas.renderAll();
        this.$emit('update:activeLayerId', layerId);
      }
    },
    toggleVisibility(layerId) {
      const targetObject = this.canvas.getObjects().find(obj => 
        (obj.id || obj.__id) === layerId
      );
      if (targetObject) {
        targetObject.visible = !targetObject.visible;
        this.canvas.renderAll();
        this.updateLayers();
      }
    }
  }
};
</script>

<style scoped>
.layer-panel {
  padding: 16px;
  border-left: 1px solid #e0e0e0;
  background: #f9f9f9;
  min-width: 200px;
}

.layer-panel h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #333;
}

.layers-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.layer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.layer-item:hover {
  background: #f0f0f0;
}

.layer-item.active {
  border-color: #007bff;
  background: #e3f2fd;
}

.layer-name {
  font-weight: 500;
  flex: 1;
}

.layer-type {
  font-size: 12px;
  color: #666;
  margin-right: 8px;
}

.layer-visibility {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
}
</style>
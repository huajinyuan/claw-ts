<template>
  <div class="asset-library">
    <h3>素材库</h3>
    <div class="categories">
      <button 
        v-for="category in categories" 
        :key="category.id"
        :class="{ active: selectedCategory === category.id }"
        @click="selectCategory(category.id)"
      >
        {{ category.name }}
      </button>
    </div>
    
    <div class="assets-grid">
      <div 
        v-for="asset in filteredAssets" 
        :key="asset.id"
        class="asset-item"
        draggable="true"
        @dragstart="onDragStart($event, asset)"
      >
        <img 
          v-if="asset.type === 'image'" 
          :src="asset.thumbnail" 
          :alt="asset.name"
        />
        <div v-else class="text-preview">
          {{ asset.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AssetLibrary',
  data() {
    return {
      categories: [
        { id: 'text', name: '文本' },
        { id: 'image', name: '图片' },
        { id: 'shape', name: '形状' },
        { id: 'template', name: '模板' }
      ],
      selectedCategory: 'text',
      assets: [
        // 文本素材
        { id: 1, type: 'text', name: '标题文本', category: 'text' },
        { id: 2, type: 'text', name: '副标题', category: 'text' },
        { id: 3, type: 'text', name: '正文', category: 'text' },
        // 图片素材
        { id: 4, type: 'image', name: '背景图1', category: 'image', thumbnail: '/placeholder-bg1.jpg' },
        { id: 5, type: 'image', name: '背景图2', category: 'image', thumbnail: '/placeholder-bg2.jpg' },
        // 形状素材
        { id: 6, type: 'shape', name: '矩形', category: 'shape' },
        { id: 7, type: 'shape', name: '圆形', category: 'shape' },
        { id: 8, type: 'shape', name: '三角形', category: 'shape' }
      ]
    }
  },
  computed: {
    filteredAssets() {
      return this.assets.filter(asset => asset.category === this.selectedCategory)
    }
  },
  methods: {
    selectCategory(categoryId) {
      this.selectedCategory = categoryId
    },
    onDragStart(event, asset) {
      event.dataTransfer.setData('application/json', JSON.stringify(asset))
    }
  }
}
</script>

<style scoped>
.asset-library {
  width: 250px;
  height: 100%;
  background: #f5f5f5;
  padding: 16px;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}

.categories {
  margin-bottom: 16px;
}

.categories button {
  margin-right: 8px;
  padding: 6px 12px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
}

.categories button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.assets-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.asset-item {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  cursor: grab;
  background: white;
  text-align: center;
}

.asset-item img {
  width: 100%;
  height: 80px;
  object-fit: cover;
}

.text-preview {
  padding: 20px 0;
  color: #666;
}
</style>
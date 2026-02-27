import { createStore } from 'vuex';

export default createStore({
  state: {
    canvas: null,
    selectedObject: null,
    assets: [
      { id: 1, type: 'text', name: '文本框', preview: 'T' },
      { id: 2, type: 'image', name: '图片', preview: '🖼️' },
      { id: 3, type: 'rectangle', name: '矩形', preview: '▭' },
      { id: 4, type: 'circle', name: '圆形', preview: '○' },
      { id: 5, type: 'triangle', name: '三角形', preview: '△' }
    ],
    templates: []
  },
  mutations: {
    SET_CANVAS(state, canvas) {
      state.canvas = canvas;
    },
    SET_SELECTED_OBJECT(state, object) {
      state.selectedObject = object;
    },
    ADD_TEMPLATE(state, template) {
      state.templates.push(template);
    }
  },
  actions: {
    async loadTemplates({ commit }) {
      // 从后端加载模板
      try {
        const response = await fetch('/api/templates');
        const templates = await response.json();
        commit('SET_TEMPLATES', templates);
      } catch (error) {
        console.error('Failed to load templates:', error);
      }
    }
  },
  modules: {}
});
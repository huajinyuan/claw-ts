// Fabric.js 工具函数
export const createFabricObject = (type, options) => {
  switch (type) {
    case 'text':
      return new fabric.Text(options.text || '双击编辑', {
        ...options,
        fontSize: options.fontSize || 20,
        fill: options.fill || '#000000',
        fontFamily: options.fontFamily || 'Arial'
      });
    case 'rect':
      return new fabric.Rect({
        ...options,
        width: options.width || 100,
        height: options.height || 100,
        fill: options.fill || '#cccccc',
        stroke: options.stroke || '#000000',
        strokeWidth: options.strokeWidth || 1
      });
    case 'circle':
      return new fabric.Circle({
        ...options,
        radius: options.radius || 50,
        fill: options.fill || '#cccccc',
        stroke: options.stroke || '#000000',
        strokeWidth: options.strokeWidth || 1
      });
    case 'triangle':
      return new fabric.Triangle({
        ...options,
        width: options.width || 100,
        height: options.height || 100,
        fill: options.fill || '#cccccc',
        stroke: options.stroke || '#000000',
        strokeWidth: options.strokeWidth || 1
      });
    case 'image':
      return new fabric.Image(options.image, {
        ...options,
        width: options.width || 200,
        height: options.height || 200
      });
    default:
      return new fabric.Rect({
        ...options,
        width: 100,
        height: 100,
        fill: '#cccccc'
      });
  }
};

export const serializeCanvas = (canvas) => {
  return JSON.stringify(canvas.toJSON(['id', 'name', 'category']));
};

export const deserializeCanvas = (canvas, data) => {
  canvas.clear();
  canvas.loadFromJSON(data, () => {
    canvas.renderAll();
  });
};
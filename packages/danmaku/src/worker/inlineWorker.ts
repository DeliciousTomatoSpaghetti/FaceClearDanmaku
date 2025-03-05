// 主线程代码
const workerCode = `
self.onmessage = function (e) {
  const { frameData, segmentationResult } = e.data;

  let ifHasBody = false;
  // 应用分割蒙版
  for (let i = 0; i < segmentationResult.length; i++) {
    if (segmentationResult[i] === 0) { // 背景像素
      frameData.data[i * 4 + 3] = 255; // 设置完全透明
    } else { // 人物像素
      ifHasBody = true;
      frameData.data[i * 4] = 0;     // R 设置为 0
      frameData.data[i * 4 + 1] = 0; // G 设置为 0
      frameData.data[i * 4 + 2] = 0; // B 设置为 0
      frameData.data[i * 4 + 3] = 0; // 保持不透明
    }
  }

  if (!ifHasBody) {
    self.postMessage(null);
    return;
  }
  // 将 ImageData 转换为 Base64
  imageDataToBase64(frameData).then((base64) => {
    // 将 Base64 返回给主线程
    self.postMessage(base64);
  });
}

function imageDataToBase64(imageData) {
  // 创建一个临时 canvas
  const canvas = new OffscreenCanvas(imageData.width, imageData.height);
  const ctx = canvas.getContext("2d");

  // 将 ImageData 绘制到 canvas
  ctx.putImageData(imageData, 0, 0);

  // 将 canvas 转换为 Base64
  return canvas.convertToBlob().then((blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  });
}
`;

// 将 Worker 代码转换为 Blob
const blob = new Blob([workerCode], { type: 'application/javascript' });

// 创建 Worker
export const toDataURLWorker = new Worker(URL.createObjectURL(blob));

// 监听 Worker 的消息
// toDataURLWorker.onmessage = (event) => {
//   console.log('Received message from worker:', event.data);
// };

// 向 Worker 发送消息
// worker.postMessage('hello');
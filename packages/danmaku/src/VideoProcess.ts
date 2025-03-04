// import * as bodyPix from '@tensorflow-models/body-pix';
// import '@tensorflow/tfjs-backend-webgl';


// export async function processVideoSegmentation(videoElement: HTMLVideoElement) {
//   try {
//     // 设置画布尺寸与视频一致
//     console.log(videoElement.videoWidth, videoElement.videoHeight);

//     // 创建离屏canvas处理视频帧
//     const offscreenCanvas = document.createElement('canvas');
//     const offscreenContext = offscreenCanvas.getContext('2d', { willReadFrequently: true });

//     offscreenCanvas.width = videoElement.videoWidth;
//     offscreenCanvas.height = videoElement.videoHeight;

//     // 加载BodyPix模型
//     const segmentationModel = await bodyPix.load();

//     // 帧处理函数
//     async function processFrame() {
//       try {
//         if (!offscreenContext) {
//           throw new Error('Offscreen canvas context unavailable');
//           return 
//         }
//         // 绘制当前视频帧到离屏canvas
//         offscreenContext.drawImage(
//           videoElement,
//           0, 0,
//           videoElement.videoWidth,
//           videoElement.videoHeight
//         );

//         // 执行人物分割
//         const segmentationResult = await segmentationModel.segmentPerson(offscreenCanvas, {
//           segmentationThreshold: 0.7,
//           internalResolution: 'medium',
//           maxDetections: 1
//         });
//         // 获取像素数据
//         const frameData = offscreenContext.getImageData(
//           0, 0,
//           videoElement.videoWidth,
//           videoElement.videoHeight
//         );

//         // 应用分割蒙版
//         for (let i = 0; i < segmentationResult.data.length; i++) {
//           if (segmentationResult.data[i] === 0) { // 背景像素
//             frameData.data[i * 4 + 3] = 0; // 设置完全透明
//           } else { // 人物像素
//             frameData.data[i * 4] = 0;     // R 设置为 0
//             frameData.data[i * 4 + 1] = 0; // G 设置为 0
//             frameData.data[i * 4 + 2] = 0; // B 设置为 0
//             frameData.data[i * 4 + 3] = 255; // 保持不透明
//           }
//         }

//         // 绘制到主canvas
//         canvasContext.putImageData(frameData, 0, 0);
//         requestAnimationFrame(processFrame);
//       } catch (frameError) {
//         console.error('Frame processing error:', frameError);
//       }
//     }

//     // 启动帧处理循环
//     processFrame();
//   } catch (modelError) {
//     console.error('Model initialization failed:', modelError);
//   }
// }
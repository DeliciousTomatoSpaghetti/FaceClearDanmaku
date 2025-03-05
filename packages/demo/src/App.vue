<template>
  <div>
    <div ref="testDivRef" style="width: 400px;height: 600px;margin: 30px;background-color: aquamarine;">
      <video ref="testVideoRef" src="../public/dance.mp4" autoplay loop muted controls style="width:100%;
       height: 100%;
      ">
      </video>
    </div>
    <div style="padding-left: 100px;">
      <button @click="send">send</button>
      <button @click="start">start</button>
      <button @click="stop">stop</button>
      <button @click="pause">pause</button>
      <button @click="process">图像处理</button>
      <button @click="stopProcess">停止图像处理</button>
      <!-- <button>send</button> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DanmakuEngine } from 'danmaku';
import { onMounted, ref } from 'vue';

const testDivRef = ref(null)
const testVideoRef = ref(null)

let engine: DanmakuEngine | null = null
onMounted(() => {
  console.log(testDivRef.value);
  if (testDivRef.value && testVideoRef.value) {
    engine = new DanmakuEngine(testDivRef.value, testVideoRef.value, {})
  }
})

function send() {
  if (engine) {
    engine.send(generateRandomString())
  }
}

function start() {
  if (engine) {
    engine.startPlaying()
  }
}

function stop() {
  if (engine) {
    engine.stopPlaying()
  }
}

function pause() {
  if (engine) {
    engine.pause()
  }
}

function process() {
  if (engine) {
    engine.startBodySegmentation()
  }
}

function stopProcess() {
  if (engine) {
    engine.stopBodySegmentation()
  }
}

function generateRandomString(minLength: number = 5, maxLength: number = 20): string {
  const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length: number = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let result: string = '';
  for (let i: number = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

</script>
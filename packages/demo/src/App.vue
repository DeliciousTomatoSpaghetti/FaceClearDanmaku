<template>
  <div>
    <div ref="testDivRef" style="width: 800px;height: 400px;margin: 100px;background-color: aquamarine;">
    </div>
    <div style="padding-left: 100px;">
      <button @click="send">send</button>
      <button @click="start">start</button>
      <button @click="stop">stop</button>
      <!-- <button>send</button> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DanmakuEngine } from 'danmaku';
import { onMounted, ref } from 'vue';

const testDivRef = ref(null)
let engine: DanmakuEngine | null = null
onMounted(() => {
  console.log(testDivRef.value);
  if (testDivRef.value) {
    engine = new DanmakuEngine(testDivRef.value, {})
  }
})

function send() {
  if (engine) {
    engine.send("wtf")
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



</script>
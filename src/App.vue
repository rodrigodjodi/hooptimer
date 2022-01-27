<script setup>
import { useIntervalFn } from "@vueuse/core";
import { ref, computed } from "vue";
import bBeep from "browser-beep";
const DEFAULT_TIME = 600
const beep = bBeep({ frequency: 1000 });
const beep2 = bBeep({ frequency: 2000, interval: 15 });
const beep3 = bBeep({ frequency: 2000, interval: 500 });
const timeLeft = ref(DEFAULT_TIME);
const endGame = ref(false);

const { pause, resume, isActive } = useIntervalFn(
  () => {
    timeLeft.value--;
    if (timeLeft.value === 120) beep3(2);
    if (timeLeft.value < 11) {
      endGame.value = true;
      beep2(1);
    }
    if (timeLeft.value === 0) {
      pause();
      beep2(100);
    }
  },
  1000,
  { immediate: false }
);
const clockTime = computed(() => {
  var seconds = timeLeft.value % 60;
  if (seconds.toString().length <= 1) {
    seconds = "0" + seconds.toString();
  }
  var minutes = Math.trunc(timeLeft.value / 60) % 60;
  return minutes + ":" + seconds;
});
const onClockClicked = () => {
  beep(1);
  if (isActive.value) {
    pause();
  } else {
    if (timeLeft.value === 0) {
      endGame.value = false;
      timeLeft.value = DEFAULT_TIME;
    } else {
      resume();
    }
  }
};
</script>

<template>
  <h1 @click="onClockClicked" :class="{ 'red-text': endGame }">
    {{ clockTime }}
  </h1>
</template>

<style>
body {
  background-color: black;
  margin: 0;
  padding: 0;
}
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  display: flex;
  height: 100vh;
  align-items: center;
}

h1 {
  color: #e9e9e9;
  margin: 0 auto;
  font-size: 38vw;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
.red-text {
  color: red;
}
</style>

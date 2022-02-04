<script setup>
import { ref, computed, reactive } from "vue";
import reloadPrompt from "./components/ReloadPrompt.vue";
import { useIntervalFn, useWakeLock } from "@vueuse/core";
import { useStorage } from "@vueuse/core";
import { uiBeep, buzzer, twoMinBeep } from "./assets/useBeep.js";
const wakeLock = reactive(useWakeLock());

const PREVENT_SLEEP = useStorage("prevent-sleep", true);
const DEFAULT_TIME = useStorage("default-time", 600);
const openControls = ref(false);
const endGame = ref(false);
const timeLeft = ref(DEFAULT_TIME.value);
const { pause, resume, isActive } = useIntervalFn(
  () => {
    timeLeft.value--;
    if (timeLeft.value === 120) twoMinBeep(2);
    if (timeLeft.value < 11) {
      endGame.value = true;
      buzzer(1);
    }
    if (timeLeft.value === 0) {
      pause();
      buzzer(100);
      wakeLock.release();
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
  if (openControls.value) return;
  uiBeep(1);
  if (isActive.value) {
    pause();
  } else {
    if (timeLeft.value === 0) {
      reset();
    } else {
      resume();
      if (PREVENT_SLEEP.value) wakeLock.request();
    }
  }
};
const reset = () => {
  wakeLock.release();
  endGame.value = false;
  timeLeft.value = DEFAULT_TIME.value;
};
function onSliderChange(ev) {
  DEFAULT_TIME.value = ev.target.value;
  timeLeft.value = DEFAULT_TIME.value;
}
function onSliderEnd(ev) {
  openControls.value = false;
}
</script>

<template>
  <div class="timer_container">
    <h1
      @click="onClockClicked"
      :class="{ 'red-text': endGame, 'greyed-out': openControls }"
    >
      {{ clockTime }}
    </h1>
    <input
      v-if="openControls && timeLeft === DEFAULT_TIME"
      id="timeSlider"
      type="range"
      min="5"
      max="1200"
      step="5"
      :value="DEFAULT_TIME"
      @input="onSliderChange"
      @mouseup="onSliderEnd"
    />
  </div>
  <svg
    class="settings_btn"
    viewBox="0 0 24 24"
    @click="openControls = !openControls"
  >
    <path
      fill="#e9e9e9"
      d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"
    />
  </svg>
  <svg
    class="reset_btn"
    viewBox="0 0 24 24"
    v-if="!isActive && timeLeft !== DEFAULT_TIME"
    @click="reset"
  >
    <path
      fill="#e9e9e9"
      d="M2 12C2 16.97 6.03 21 11 21C13.39 21 15.68 20.06 17.4 18.4L15.9 16.9C14.63 18.25 12.86 19 11 19C4.76 19 1.64 11.46 6.05 7.05C10.46 2.64 18 5.77 18 12H15L19 16H19.1L23 12H20C20 7.03 15.97 3 11 3C6.03 3 2 7.03 2 12Z"
    />
  </svg>
  <reloadPrompt />
  <!-- <input v-if="openControls"
        type="checkbox"
        :checked="PREVENT_SLEEP"
        @change="PREVENT_SLEEP = !PREVENT_SLEEP"
        id="prevent-sleep"
        name="prevent-sleep"
      />
      <label for="prevent-sleep">Impedir descanso de tela</label><br/> -->
</template>

<style>
body {
  background-color: black;
  margin: 0;
  padding: 0;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  height: 100vh;
  align-items: center;
  justify-content: space-between;
}
#timeSlider {
  width: 90vw;
}
.timer_container {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  margin: 0;
  padding: 0;
  align-items: center;
}
h1 {
  font-family: Roboto, Helvetica, Arial, sans-serif;
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
.greyed-out {
  color: gray;
}
.settings_btn {
  margin: 16px 16px 0 0;
  width: 24px;
  height: 24px;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 100;
}
.reset_btn {
  margin: 16px;
  width: 24px;
  height: 24px;
  position: absolute;
  right: 0;
  bottom: 0;
}
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 10;
}
.center {
  z-index: 20;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
}
</style>

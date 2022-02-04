import bBeep from "browser-beep";
export const uiBeep = bBeep({ frequency: 1000 });
export const buzzer = bBeep({ frequency: 2000, interval: 15 });
export const twoMinBeep = bBeep({ frequency: 2000, interval: 500 });
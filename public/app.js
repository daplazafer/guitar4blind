import { transcribe } from "./transcribe.js";
import { translatePlaceholders, readLine } from "./i18n.js";

let transcribed = [[]];
let block = 0;
let line = 0;

document.getElementById("transcribe-button").addEventListener("click", () => {
  const tablature = document.getElementById("tab-to-transcribe").value;
  transcribed = transcribe(tablature);
  block = 0;
  line = 0;
  console.log(transcribed);
});

document.getElementById("read-button").addEventListener("click", () => {
  if (transcribed.length > 0) {
    console.log(transcribed);
    let translated = translatePlaceholders(transcribed[block][line]);
    readLine(translated);
  }
  line++;
  if (line == transcribed[block].length) {
    line = 0;
    block++;
  }
  console.log(line);
});

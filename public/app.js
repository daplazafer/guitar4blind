import { transcribe } from "./transcribe.js";

class App {
  constructor() {
    this.transcribeButton = document.getElementById("transcribe-button");
    this.textToRead = document.getElementById("text-to-read");
    this.transcribedTextArea = document.getElementById("transcribed");

    this.initialize();
  }

  initialize() {
    this.transcribeButton.addEventListener("click", () =>
      this.handleTranscribe()
    );
  }

  handleTranscribe() {
    const tablature = this.textToRead.value;

    if (tablature.trim() !== "") {
      const transcribedText = transcribe(tablature);
      console.log("Transcribed Text:", transcribedText);

      if (Array.isArray(transcribedText)) {
        this.transcribedTextArea.value = transcribedText;
        console.log("Transcription complete:", transcribedText);
      } else {
        console.error(
          "Transcription failed: transcribe function did not return an array."
        );
      }
    } else {
      console.log("No tablature to transcribe.");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new App();
});

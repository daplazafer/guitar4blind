function detectStringCount(line) {
  const firstChar = line.trim()[0];

  if (/[eE]/.test(firstChar)) return 6; // Standard 6-string guitar
  if (/[bB]/.test(firstChar)) return 7; // 7-string guitar
  if (/[fF]/.test(firstChar)) return 8; // 8-string guitar (often with F# or B strings)
  if (/[GD]/.test(firstChar)) return 4; // 4-string bass
  if (/^[BA]/.test(firstChar)) return 5; // 5-string bass (with B and A as lowest strings)

  return 6;
}

function transcribe(tablature) {
  const lines = tablature
    .split("\n")
    .filter(
      (line) =>
        /^[EBGDAebgda]\|[-]|['F#']/.test(line.trim()) ||
        /^\|-/.test(line.trim())
    );

  const output = [];

  let i = 0;
  while (i < lines.length) {
    const block = [];

    const stringCount = detectStringCount(lines[i]);

    for (let j = 0; j < stringCount && i < lines.length; j++, i++) {
      block.push(lines[i]);
    }

    if (block.length > 0) {
      output.push(`Block ${output.length + 1}:`);
      output.push(processBlock(block));
    }
  }

  return output;
}

function processBlock(block) {
  const maxLength = Math.max(...block.map((line) => line.length));
  const matrix = block.map((line) =>
    line
      .replace(/^[^\d-]+/, "")
      .padEnd(maxLength, " ")
      .split("")
  );

  const result = [];
  let pendingAdornment = null;

  for (let columnIndex = 0; columnIndex < maxLength; columnIndex++) {
    let notesInColumn = [];
    let adornmentsInColumn = [];

    for (let stringIndex = block.length - 1; stringIndex >= 0; stringIndex--) {
      if (matrix[stringIndex] && matrix[stringIndex][columnIndex]) {
        let currentChar = matrix[stringIndex][columnIndex];

        if (/\d/.test(currentChar)) {
          let fret = currentChar;

          if (
            columnIndex + 1 < matrix[stringIndex].length &&
            /\d/.test(matrix[stringIndex][columnIndex + 1])
          ) {
            fret += matrix[stringIndex][columnIndex + 1];
            matrix[stringIndex][columnIndex + 1] = "x";
          }

          fret = fret === "0" ? "open" : `fret ${fret}`;
          let noteString = `string ${stringIndex + 1} ${fret}`;

          if (pendingAdornment) {
            if (pendingAdornment === "tapping") {
              noteString += " (tapping-release)";
            } else {
              noteString += ` (${pendingAdornment})`;
            }
            pendingAdornment = null;
          }

          notesInColumn.push(noteString);

          if (
            columnIndex + 1 < matrix[stringIndex].length &&
            /[pr~bt/\\]/.test(matrix[stringIndex][columnIndex + 1])
          ) {
            const adornment = detectAdornment(
              matrix[stringIndex][columnIndex + 1]
            );
            adornmentsInColumn.push(adornment);
          }
        } else if (/[ht]/.test(currentChar)) {
          pendingAdornment = detectAdornment(currentChar);
        }
      }
    }

    if (notesInColumn.length > 0) {
      const adornedNoteString =
        notesInColumn.join(", ") +
        (adornmentsInColumn.length > 0
          ? ` (${adornmentsInColumn.join(", ")})`
          : "");
      result.push(adornedNoteString + ";");
    }
  }

  return result;
}

function detectAdornment(adornment) {
  switch (adornment) {
    case "p":
      return "pull-off";
    case "r":
      return "release";
    case "h":
      return "hammer-on";
    case "t":
      return "tapping";
    case "~":
      return "vibrato";
    case "b":
      return "bending";
    case "/":
      return "slide up";
    case "\\":
      return "slide down";
    default:
      return "";
  }
}

const tablatureText = `
  e|-----------------------------------|
  b|-----------------------------------|
  g|-----(2)h4-0---0-------------------|
  D|-10----------0----4t2-----(2)h4~~--|
  A|-10--------------------2-----------|
  E|-8---------------------------------|
  
  e|-10-8b7------8r7---------------7~--|
  b|--------h10-------10r8\\7/8p10------|
  g|-----------------------------------|
  D|-----------------------------------|
  A|-----------------------------------|
  E|-----------------------------------|
  `;

console.log(transcribe(tablatureText));

// Detect the number of strings based on the first character of the line
function detectStringCount(line) {
  const firstChar = line.trim()[0];

  if (/[eE]/.test(firstChar)) return 6; // Standard 6-string guitar
  if (/[bB]/.test(firstChar)) return 7; // 7-string guitar
  if (/[fF]/.test(firstChar)) return 8; // 8-string guitar
  if (/[GD]/.test(firstChar)) return 4; // 4-string bass
  if (/^[BA]/.test(firstChar)) return 5; // 5-string bass

  return 6;
}

// Main function to transcribe the tablature
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

  // Process blocks of tablature based on the number of strings
  while (i < lines.length) {
    const block = [];
    const stringCount = detectStringCount(lines[i]);

    for (let j = 0; j < stringCount && i < lines.length; j++, i++) {
      block.push(lines[i]);
    }

    if (block.length > 0) {
      output.push(processBlock(block)); // Process each block
    }
  }

  return output;
}

// Process each block of tablature and detect notes and adornments
function processBlock(block) {
  const maxLength = Math.max(...block.map((line) => line.length));
  let matrix = block.map((line) =>
    line
      .replace(/^[^\d-]+/, "")
      .padEnd(maxLength, " ")
      .split("")
  );

  matrix = preprocessBlockForDoubleDigits(matrix);

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
          fret = fret === "0" ? "{open}" : `{fret} ${fret}`;
          let noteString = `{string} ${stringIndex + 1} ${fret}`;

          if (pendingAdornment) {
            // Handle pending adornments like tapping or hammer-on
            if (pendingAdornment === "tapping") {
              noteString += " {tapping-release}";
            } else if (pendingAdornment === "hammer-on") {
              noteString = "{hammer-on} " + noteString;
            }
            pendingAdornment = null;
          }

          // Detect adornments after a note
          if (
            columnIndex + 1 < matrix[stringIndex].length &&
            /[pr~bt/\\]/.test(matrix[stringIndex][columnIndex + 1])
          ) {
            const adornment = detectAdornment(
              matrix[stringIndex][columnIndex + 1]
            );
            if (adornment === "tapping") {
              noteString = "{tapping-hold} " + noteString;
            } else {
              adornmentsInColumn.push(`{${adornment}}`);
            }
          }

          notesInColumn.push(noteString);
        } else if (/[ht]/.test(currentChar)) {
          // Set pending adornments (hammer-on or tapping) for the next note
          pendingAdornment = detectAdornment(currentChar);
        }
      }
    }

    if (notesInColumn.length > 0) {
      const adornedNoteString =
        notesInColumn.join(", ") +
        (adornmentsInColumn.length > 0
          ? ` ${adornmentsInColumn.join(", ")}`
          : "");
      result.push(adornedNoteString + ";");
    }
  }

  return result;
}

// Handle two-digit frets by combining digits and adjusting the matrix
function preprocessBlockForDoubleDigits(matrix) {
  for (let columnIndex = 0; columnIndex < matrix[0].length - 1; columnIndex++) {
    let shouldRemoveNextCell = false;

    // Check if the current position has a two-digit fret
    for (let stringIndex = 0; stringIndex < matrix.length; stringIndex++) {
      if (
        /\d/.test(matrix[stringIndex][columnIndex]) &&
        /\d/.test(matrix[stringIndex][columnIndex + 1])
      ) {
        matrix[stringIndex][columnIndex] +=
          matrix[stringIndex][columnIndex + 1];
        shouldRemoveNextCell = true;
      }
    }

    // Remove the next cell for all strings if a two-digit fret was found
    if (shouldRemoveNextCell) {
      for (let stringIndex = 0; stringIndex < matrix.length; stringIndex++) {
        matrix[stringIndex].splice(columnIndex + 1, 1);
      }
    }
  }

  return matrix;
}

// Detect specific adornments in the tablature
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
      return "slide-up";
    case "\\":
      return "slide-down";
    default:
      return "";
  }
}

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
  let blockNumber = 1; // Add blockNumber to keep track of block numbering

  while (i < lines.length) {
    const block = [];
    const stringCount = detectStringCount(lines[i]);

    for (let j = 0; j < stringCount && i < lines.length; j++, i++) {
      block.push(lines[i]);
    }

    if (block.length > 0) {
      output.push(`Block ${blockNumber++}:`); // Increment block number after adding block
      output.push(processBlock(block));
    }
  }

  return output;
}

function processBlock(block) {
  const maxLength = Math.max(...block.map((line) => line.length));
  let matrix = block.map((line) =>
    line
      .replace(/^[^\d-]+/, "")
      .padEnd(maxLength, " ")
      .split("")
  );

  // Preprocess the block to handle two-digit frets
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

          fret = fret === "0" ? "open" : `fret ${fret}`;
          let noteString = `string ${stringIndex + 1} ${fret}`;

          if (pendingAdornment) {
            if (pendingAdornment === "tapping") {
              noteString += " (tapping-release)";
            } else if (pendingAdornment === "hammer-on") {
              noteString = "(hammer-on) " + noteString;
            }
            pendingAdornment = null;
          }

          notesInColumn.push(noteString);

          // Check if there is an adornment
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

function preprocessBlockForDoubleDigits(matrix) {
  for (let columnIndex = 0; columnIndex < matrix[0].length - 1; columnIndex++) {
    let shouldRemoveNextCell = false;

    // Verificar todas las cuerdas en la columna actual
    for (let stringIndex = 0; stringIndex < matrix.length; stringIndex++) {
      if (
        /\d/.test(matrix[stringIndex][columnIndex]) &&
        /\d/.test(matrix[stringIndex][columnIndex + 1])
      ) {
        // Combina los dos dígitos
        matrix[stringIndex][columnIndex] +=
          matrix[stringIndex][columnIndex + 1];
        shouldRemoveNextCell = true;
      }
    }

    // Si encontramos una nota de dos dígitos, eliminamos la siguiente celda para todas las cuerdas
    if (shouldRemoveNextCell) {
      for (let stringIndex = 0; stringIndex < matrix.length; stringIndex++) {
        matrix[stringIndex].splice(columnIndex + 1, 1); // Elimina la celda en la columna siguiente
      }
    }
  }

  return matrix;
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

function transcribe(tablature) {
  const lines = tablature.split("\n").filter((line) => line.trim() !== "");
  const output = [];

  for (let i = 0; i < lines.length; i += 6) {
    const block = lines.slice(i, i + 6);
    output.push(`Block ${Math.floor(i / 6) + 1}:`);
    output.push(processBlock(block));
  }

  return output.join("\n");
}

function processBlock(block) {
  const matrix = block.map((line) => line.replace(/^[^\d-]+/, "").split(""));
  const result = [];

  for (let columnIndex = 0; columnIndex < matrix[0].length; columnIndex++) {
    let notesInColumn = [];

    for (let stringIndex = 5; stringIndex >= 0; stringIndex--) {
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
        notesInColumn.push(`string ${stringIndex + 1} ${fret}`);
      }
    }

    if (notesInColumn.length > 0) {
      result.push(notesInColumn.join(", ") + ";");
    }
  }

  return result.join("\n");
}

const tablatureText = `
  e|-----------------------------------|
  b|-----------------------------------|
  g|-----(2)h4-0---0-------------------|
  D|-10----------0----4-2-----(2)h4~~--|
  A|-10--------------------2-----------|
  E|-8---------------------------------|
  
  e|-10-8b7------8r7---------------7~--|
  b|--------h10-------10r8\\7/8-10------|
  g|-----------------------------------|
  D|-----------------------------------|
  A|-----------------------------------|
  E|-----------------------------------|
  `;

console.log(transcribe(tablatureText));

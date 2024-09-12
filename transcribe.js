function transcribe(tablature) {
  const lines = tablature
    .split("\n")
    .filter(
      (line) => /^[ebgdaDAE]\|[-]/.test(line.trim()) || /^\|-/.test(line.trim())
    );
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

const tablatureText1 = `
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

const tablatureText = `
  i pretty much play the riffs the same as every other version on here
  so here's my way of playing Kirk Hammet's solo.
  
  e|-17-12------------12-17-12------------12-17-12------------12--|
  b|--------13-12-13------------13-12-13------------13-12-13------|
  g|--------------------------------------------------------------|
  D|--------------------------------------------------------------|
  A|--------------------------------------------------------------|
  E|--------------------------------------------------------------|
  
                                              (whammy bar)
  e|-----------17p15p14--------------------------------/\/\/--|
  b|-17p15p14------------17p15p14---------------------/-------|
  g|--------------------------------16-14~~--<6>\----/--------|
  D|---------------------------------------------\/\/---------|
  A|----------------------------------------------------------|
  E|----------------------------------------------------------|
  
  /\(vigorous whammy bar dive)
  e|-22b24/--\/\--------------------------------------|
  b|------------\/\-----------------------------------|
  g|---------------\/\--------------------------------|
  D|------------------\/\-----------------------------|
  A|---------------------\/\--------------------------|
  E|------------------------\/\-----------------------|
  
  ************************************
  
  | p  Pull-off
  | r  Release
  | b  Bend
  | /  Slide up
  | ~  Vibrato
  
  ************************************
  `;

console.log(transcribe(tablatureText));

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/api/languages", (req, res) => {
  const localesDir = path.join(__dirname, "public", "locales");
  fs.readdir(localesDir, (err, files) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Unable to read locales directory" });
    }

    const languages = files
      .filter((file) => file.endsWith(".json"))
      .map((file) => path.basename(file, ".json"));

    res.json({ languages });
  });
});

app.get("/locales/:lang.json", (req, res) => {
  const lang = req.params.lang;
  const filePath = path.join(__dirname, "public", "locales", `${lang}.json`);
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

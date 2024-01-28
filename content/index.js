// A simple nodejs process to convert docx to mdx to be used as site content.
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
require("colors");

const folder = process.argv[2];
console.log("----------------------------------------------------".green);
console.log("Discovering files in".green, folder.bgGreen.black);

// Read all files in the folder
const files = fs.readdirSync(path.join(process.cwd(), folder));

// Find and delete all previously created MDX files.
console.log("Looking for previously created files.".bgCyan.black);
const mdxFiles = files.filter((file) => file.endsWith(".mdx"));
if (mdxFiles.length > 0) {
  console.log(
    "Removing ".red,
    mdxFiles.length.toString().black.bgRed,
    " .mdx files.".red
  );
  mdxFiles.forEach((file) => {
    fs.unlinkSync(folder + file);
  });
} else console.log("No existing .mdx files found.".green.bgBlack);

// Find and convert all DOCX files to MDX
const documents = files.filter((file) => file.endsWith(".docx"));
if (documents.length > 0) {
  console.log("----------------------------------------------------".green);
  console.log(`${documents.length}`.yellow.bgRed, ".docx file(s) Found".red);

  documents.forEach((file) => {
    console.log("Converting File\t ".bgCyan.black, file.red.bgWhite);

    const sourceFile = `./${folder}/${file}`;
    const destinationFile = `./${folder}/${file.replace(".docx", ".mdx")}`;

    const pandocArgs = [
      "-s",
      sourceFile,
      "-t",
      "markdown-smart",
      "-o",
      destinationFile,
    ];
    spawnSync("pandoc", pandocArgs);
  });
  console.log("----------------------------------------------------".green);
  console.log("Conversion Finished.".yellow.bgGreen);
  console.log("----------------------------------------------------".green);
} else console.log("No .docx files found to convert.".red.bgBlack);

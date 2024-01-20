const fs = require('fs');
const path = require('path');

copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));

function copyDir(baseDirectory, newDirectory) {
  fs.mkdir(newDirectory, { recursive: true }, (err) => {
    if (err) throw err;
  });

  fs.readdir(baseDirectory, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      if (file.isFile()) {
        fs.copyFile(
          path.join(file.path, file.name),
          path.join(newDirectory, file.name),
          (err) => {
            if (err) throw err;
          },
        );
      } else if (file.isDirectory()) {
        const newSubFolder = path.join(newDirectory, file.name);
        copyDir(file.path, newSubFolder);
      }
    });
  });
}

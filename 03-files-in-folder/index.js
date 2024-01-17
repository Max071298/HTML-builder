const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      if (file.isFile()) {
        const fileExt = path.extname(file.name).slice(1);
        const fileName = file.name.slice(0, file.name.indexOf('.'));
        fs.stat(path.join(file.path, file.name), (err, fileStats) => {
          if (err) throw err;
          console.log(`${fileName} - ${fileExt} - ${fileStats.size / 1000}kb`);
        });
      }
    });
  },
);

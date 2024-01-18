const fs = require('fs');
const path = require('path');

const writeStream = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
);

fs.readdir(
  path.join(__dirname, 'styles'),
  { withFileTypes: true },
  (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      if (path.extname(file.name) === '.css') {
        const readStream = fs.createReadStream(
          path.join(file.path, file.name),
          'utf-8',
        );
        readStream.on('data', (chunk) => writeStream.write(chunk));
      }
    });
  },
);

const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  if (err) throw err;
});

fs.mkdir(
  path.join(__dirname, 'project-dist', 'assets'),
  { recursive: true },
  (err) => {
    if (err) throw err;
  },
);

const indexHTML = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'index.html'),
);

const styleCSS = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'style.css'),
);

const HTMLReadStream = fs.createReadStream(
  path.join(__dirname, 'template.html'),
  'utf-8',
);

let dataIndexHTML = '';

HTMLReadStream.on('data', (chunk) => {
  dataIndexHTML += chunk;
});

// 1. HTML file building
HTMLReadStream.on('end', () => {
  dataIndexHTML = dataIndexHTML.split('{{');
  fs.readdir(
    path.join(__dirname, 'components'),
    { withFileTypes: true },
    (err, files) => {
      if (err) throw err;
      files.forEach((file, id, arr) => {
        const fileName = file.name.slice(0, file.name.indexOf('.'));
        const changeInd = dataIndexHTML.findIndex((elem) =>
          elem.startsWith(fileName),
        );
        let curFileData = '';
        const readCurStream = fs.createReadStream(
          path.join(file.path, file.name),
          'utf-8',
        );
        readCurStream.on('data', (chunk) => (curFileData += chunk));
        readCurStream.on('end', () => {
          dataIndexHTML[changeInd] =
            curFileData +
            dataIndexHTML[changeInd].slice(
              fileName.length + 1,
              dataIndexHTML.length,
            );
          if (id === arr.length - 1) indexHTML.write(dataIndexHTML.join(''));
        });
      });
    },
  );
});

// 2.css file building

fs.readdir(
  path.join(__dirname, 'styles'),
  { withFileTypes: true },
  (err, files) => {
    if (err) throw err;
    let CSSData = '';
    files.forEach((file, id, arr) => {
      const readCurStream = fs.createReadStream(
        path.join(file.path, file.name),
        'utf-8',
      );
      readCurStream.on('data', (chunk) => (CSSData += chunk));
      readCurStream.on('end', () => {
        if (id === arr.length - 1) styleCSS.write(CSSData);
      });
    });
  },
);

// 3. assets copying

fs.readdir(
  path.join(__dirname, 'assets'),
  { withFileTypes: true },
  (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      fs.mkdir(
        path.join(__dirname, 'project-dist', 'assets', file.name),
        { recursive: true },
        (err) => {
          if (err) throw err;
        },
      );

      fs.readdir(
        path.join(file.path, file.name),
        { withFileTypes: true },
        (err, deepFiles) => {
          if (err) throw err;
          deepFiles.forEach((deepFile) => {
            fs.copyFile(
              path.join(deepFile.path, deepFile.name),
              path.join(
                __dirname,
                'project-dist',
                'assets',
                file.name,
                deepFile.name,
              ),
              (err) => {
                if (err) throw err;
              },
            );
          });
        },
      );
    });
  },
);

const fs = require('fs');
const path = require('path');
const { stdin, stdout, stderr } = process;

const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Please, write your text\n');
stdin.on('data', (chunk) => {
  if (chunk.toString().slice(0, 4) == 'exit' && chunk.toString().length === 6) {
    process.exit();
  } else {
    writeStream.write(chunk);
  }
});

process.on('exit', (code) => {
  if (code === 0) {
    stdout.write('Txt file has been written!');
  } else {
    stderr.write(`Something went wrong, program exited with code ${code}`);
  }
});

process.on('SIGINT', () => process.exit());

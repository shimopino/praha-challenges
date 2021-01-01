const fs = require('fs');

const options = { eoncoding: 'utf-8' };

fs.readFile('myfile.txt', options, (err, data) => {
  if (err) {
    console.error('Error reading file');
    return;
  }
  console.log(console.log(data));
})

console.log('global end');
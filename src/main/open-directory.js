module.exports = function  openDirectory(path, event) {
  const isSupported = require('./is-supported');
  const fs = require('fs');
  globalFiles = [];

  // fs.readdir
  // fs.readdirSync
  // fs.readdir(path, (err, files) => {
  //   files.forEach(file => {
  //     if (isSupported(file)) {
  //       globalFiles.push({
  //         name: file,
  //         path: path + '\\' + file
  //       });
  //     }
  //   });
  //   event.sender.send('music-files', globalFiles);
  // });

  var files = fs.readdirSync(path)
  files.forEach(file => {
    if (isSupported(file)) {
      globalFiles.push({
        name: file,
        path: path + '\\' + file
      });
    }
  });

  return globalFiles;
};

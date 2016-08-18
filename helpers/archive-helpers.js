var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

// Paths object below will be used to pull stuff with request-handler.js
exports.paths = {
  index: path.join(__dirname, '../web/public/index.html'),
  styles: path.join(__dirname, '../web/public/styles.css'),
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    var dataArray = data.split('\n');
    callback(dataArray);
  });
};

exports.isUrlInList = function(target, callback) {
  exports.readListOfUrls(function(data) {
    callback(data.indexOf(target) !== -1);
  });
};

exports.addUrlToList = function(item, callback) {
  fs.appendFile(exports.paths.list, item + '\n', callback);
};

exports.isUrlArchived = function(target, callback) {
  fs.readdir(exports.paths.archivedSites, (err, files) => (
   callback(files.indexOf(target) !== -1) 
  ));
};

exports.downloadUrls = function(arrayOfUrls) {
  arrayOfUrls.forEach((item) => {
    exports.isUrlArchived(item, function(exists) {
      if (!exists) {
        fs.writeFile(exports.paths.archivedSites + '/' + item, item, (err) => {
          if (err) {
            throw err;
          }
        });
      }
    });
  });
};

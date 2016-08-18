var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var Promise = require('bluebird');
var promfs = Promise.promisifyAll(require('fs')); 

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

// Paths object below will be used to pull stuff with request-handler.js
exports.paths = {
  loading: path.join(__dirname, '../web/public/loading.html'),
  index: path.join(__dirname, '../web/public/index.html'),
  styles: path.join(__dirname, '../web/public/styles.css'),
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

getOptions = {
  method: 'GET'
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
  console.log('this is actually async!', callback);
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    var dataArray = data.split('\n');
    callback(dataArray);
  });
};
exports.readListOfUrlsAsync = function() {
  return promfs.readFileAsync(exports.paths.list, 'utf8')
  .then(function(data) {
    return data.split('\n');
  });
};

exports.isUrlInList = function(target, callback) {
  exports.readListOfUrls(function(data) {
    callback(data.indexOf(target) !== -1);
  });
};
// exports.isUrlInListAsync = function(target) {
//   return exports.readListOfUrlsAsync
//   .then(function(urls) {
//     return urls.indexOf(target) !== -1;
//   });
// };

exports.addUrlToList = function(item, callback) {
  fs.appendFile(exports.paths.list, item + '\n', callback);
};

// exports.addUrlToListAsync = function(item) {
//   return promfs.appendFileAsync(exports.paths.list, item + '\n');
// };

exports.isUrlArchived = function(target, callback) {
  fs.readdir(exports.paths.archivedSites, (err, files) => (
   callback(files.indexOf(target) !== -1) 
  ));
};
exports.downloadUrls = function(arrayOfUrls) {
  arrayOfUrls.forEach((item) => {
    exports.isUrlArchived(item, function(exists) {
      // If it does not exist
      if (!exists) {
        getOptions.host = item;
        // We are going to go grab it!
        // Send a GET request to sit
        var req = http.request(getOptions, function(res) {
          // Write results of GET request to a new file and put it in archive
          var chunky = '';
          res.on('data', function(chunk) {
            chunky += chunk.toString();
          });
          res.on('end', function() {
            fs.writeFile(exports.paths.archivedSites + '/' + item, chunky, 'utf-8', (err) => {
              if (err) {
                throw err;
              }
            });           
          });
        });
        req.end();
      }
    });
  });
};

exports.isUrlArchivedAsync = Promise.promisify(exports.isUrlArchived);
var requestAsync = Promise.promisify(http.request);

exports.downloadUrlsAsync = function(arrayOfUrls) {
  var promises = arrayOfUrls.map((item) => {
    return exports.isUrlArchivedAsync(item)
    .then(function(exists) {
      // If it does not exist
      if (!exists) {
        getOptions.host = item;
        // We are going to go grab it!
        // Send a GET request to sit
        var req = http.request(getOptions, function(res) {
          // Write results of GET request to a new file and put it in archive
          var chunky = '';
          res.on('data', function(chunk) {
            chunky += chunk.toString();
          });
          res.on('end', function() {
            fs.writeFile(exports.paths.archivedSites + '/' + item, chunky, 'utf-8', (err) => {
              if (err) {
                throw err;
              }
            });           
          });
        });
        req.end();
      }
    });
  });
  return Promise.all(promises);
};
var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var Promise = require('bluebird');
var promfs = Promise.promisifyAll(require('fs'));

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  fs.readFile(asset, 'utf8', (err, data) => {
    res.end(data);
    // console.log('data result from readfile: ', data);
  });

};

exports.serveAssetsAsync = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  return promfs.readFileAsync(asset, 'utf8')
    .then(function(data) {
      res.end(data);
    });
    

};



// As you progress, keep thinking about what helper functions you can put here!

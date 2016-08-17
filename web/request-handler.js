var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var helpers = require('./http-helpers');
var url = require('url');
var fs = require('fs');

exports.handleRequest = function (req, res) {
  // Build parameters to feed helpers.serveAssets
  // Parse url
  var parsed = url.parse(req.url, true, true);
  // Grab path
  var filepath = parsed.pathname;
  console.log(filepath);
  // Direct path to appropriate key in paths object
  // If path is empty then we respond with index.html
  if (filepath === '/') {
    filepath = archive.paths.index;
    // Write appropriate head
    res.writeHead(200, {'Content-Type': 'text/html'});
  }
  // Otherwise, set it to archive.paths[filepath];
  // Make sure those keys are pointed correctly!
  if (filepath === '/styles.css') {
    filepath = archive.paths.styles;
    res.writeHead(200, {'Content-Type': 'text/css'});
  }

  

  // Serve asseets with helper function
  helpers.serveAssets(res, filepath);
};

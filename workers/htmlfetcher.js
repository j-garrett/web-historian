// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
var Promise = require('bluebird');
var promDownload = Promise.promisify(require('../helpers/archive-helpers').downloadUrls);

// Scraper to be called by CRON job
var fetcher = function() {
  // Get array of currently archived URLs from sites.txt
  archive.readListOfUrls(function(urls) { //PROMISIFY
    // Callback function to download everything that hasn't been downloaded yet
    urls.pop();
    archive.downloadUrls(urls); // PROMISIFY
  });
}; 

exports.fetcher = fetcher;

var fetcherAsync = function() {
  // console.log(promArchive.readListOfUrlsAsync.toString());
  // Get array of currently archived URLs from sites.txt
  return archive.readListOfUrlsAsync()
    .then(function(urls) {
      // Callback function to download everything that hasn't been downloaded yet
      urls.pop();
      // return promDownload(urls);
      return archive.downloadUrlsAsync(urls);
    });
}; 

exports.fetcherAsync = fetcherAsync;
fetcherAsync();
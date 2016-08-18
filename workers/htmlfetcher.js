// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');

// Scraper to be called by CRON job
var fetcher = function() {
  // Get array of currently archived URLs from sites.txt
  archive.readListOfUrls(function(urls) {
    // Callback function to download everything that hasn't been downloaded yet
    urls.pop();
    archive.downloadUrls(urls);
  });
}; 

exports.fetcher = fetcher;
var url2pdf = require('./index');
var q = require('q');

console.log("Running example");
q.all([

    url2pdf.renderPdf("http://www.google.com", {paperSize: {orientation: "landscape"}}),
    url2pdf.renderPdf("http://www.google.com"),

    url2pdf.renderFromHTML("<html><body><h1>Not working due to needed loading time - no image might be present</h1><img src='http://i.imgur.com/T0BxgW3.jpg' width='400px'/></body></html>"),
    url2pdf.renderFromHTML("<html><body><h1>Page loaded with timeout. You should see a big image</h1><img src='http://i.imgur.com/T0BxgW3.jpg'/> </body></html>", {loadTimeout: 2000})
  ])
  .then(function (paths) {
    console.log("Created PDFs @", paths);
    // manual clenup could be done here, but better use autocelan
    // if you want a manual cleanup, disable autoclean by setting option: autoCleanFileAgeInSec = -1
    // then do the cleanup manual; use a timeout to prevent deleting pending operations
    // console.log("Deleted", url2pdf.cleanup(5)); // remove all files older than 5 seconds
  })
  .catch(function (err) {
    console.error(err.stack);
  });

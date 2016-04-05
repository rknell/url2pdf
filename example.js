var url2pdf = require('./index');
var q = require('q');

console.log("Running example");
q.all([

    url2pdf.renderPdf("http://www.google.com", {paperSize: {orientation: "landscape"}}),
    url2pdf.renderPdf("http://www.google.com"),
    url2pdf.renderFromHTML("<html><body><h1>HELLO WORLD</h1><img src='http://i.imgur.com/T0BxgW3.jpg' /> </body></html>"), //Not working due to image for some reason
    url2pdf.renderFromHTML("<html><body><h1>HELLO WORLD</h1></body></html>")
  ])
  .then(function (paths) {
    console.log("Created PDFs @", paths);
    console.log("Deleted", url2pdf.cleanup(20));
  })
  .catch(function (err) {
    console.error(err.stack);
  });
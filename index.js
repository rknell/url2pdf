var http = require("http");
var phantom = require("phantom");
var fs = require("fs");
var q = require('q');

var counter = 21000;

function renderpdf(url) {
  var deferred = q.defer();
  counter++;
  phantom.create(null, {port: counter}, function (ph) {
    ph.createPage(function (page) {
      page.set("paperSize", {format: "A4", orientation: 'portrait', margin: '1cm'});
      page.open(url, function (status) {
        var fileName = makeid(30) + ".pdf";

        page.render(fileName, function(){
          deferred.resolve(fileName);
          ph.exit();
        });
      })
    })
  });
  return deferred.promise;
}

function removeFile(path) {
  var deferred = q.defer();
  fs.unlink(path, function (err) {
    if (err) {
      deferred.reject(err)
    }
    else {
      deferred.resolve()
    }
  });
  return deferred.promise;
}

function makeid(strLength) {
  strLength = (typeof optionalArg === "undefined") ? 5 : strLength;
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < strLength; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

module.exports = {
  renderPdf: renderpdf,
  removeFile: removeFile,
  __makeId: makeid
}

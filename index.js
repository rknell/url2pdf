var http = require("http");
var phantom = require("phantom");
var fs = require("fs");
var q = require('q');

var counter = 21000;

function renderpdf(url) {

  var deferred = q.defer();
  var page, fileName, ph;
  counter++;
  phantom.create()
    .then(function (_ph) {
      ph = _ph;
      return ph.createPage()
    })
    .then(function (_page) {
      page = _page;
      return page.property("paperSize", {format: "A4", orientation: 'portrait', margin: '1cm'});
    })
    .then(function () {
      return page.open(url)
    })
    .then(function (status) {
      fileName = makeid(30) + ".pdf";
      return page.render(fileName);
    })
    .then(function () {
      deferred.resolve(fileName);
      ph.exit();
    })
    .catch(deferred.reject);

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

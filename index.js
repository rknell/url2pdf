var http = require("http");
var phantom = require("phantom");
var fs = require("fs");
var q = require('q');
var path = require('path');
var findRemove = require('find-remove');

var opts = {
  paperSize: {format: "A4", orientation: 'portrait', margin: '1cm'},
  saveDir: path.join(__dirname, "pdfTemp"),
  idLength: 30
};

function renderpdf(url) {
  var deferred = q.defer();
  var page, fileName, ph, fullPath;

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
      fullPath = opts.saveDir + "/" + fileName;
      return page.render(fullPath);
    })
    .then(function () {
      deferred.resolve(fullPath);
      ph.exit();
    })
    .catch(function (err) {
      deferred.reject(err)
      ph.exit();
    });

  return deferred.promise;
}

function renderFromHTML(htmlString) {
  var deferred = q.defer();
  var page, fileName, ph, fullPath;

  phantom.create()
    .then(function (_ph) {
      ph = _ph;
      return ph.createPage()
    })
    .then(function (_page) {
      page = _page;
      return q.all([
        page.property("paperSize", {format: "A4", orientation: 'portrait', margin: '1cm'}),
        page.property("content", htmlString)
      ])
    })
    .then(function (status) {
      fileName = makeid(30) + ".pdf";
      fullPath = opts.saveDir + "/" + fileName;
      return page.render(fullPath);
    })
    .then(function () {
      deferred.resolve(fullPath);
      ph.exit();
    })
    .catch(function (err) {
      deferred.reject(err)
      ph.exit();
    });

  return deferred.promise;
}

function cleanup(ageInSeconds) {
  return findRemove(opts.saveDir, {age: {seconds: ageInSeconds}});
}

function makeid(strLength) {
  if (!strLength) strLength = 30;
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < strLength; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

module.exports = {
  renderPdf: renderpdf,
  cleanup: cleanup,
  opts: opts,
  renderFromHTML: renderFromHTML
};
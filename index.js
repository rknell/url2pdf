"use strict";

var http = require("http");
var phantom = require("phantom");
var fs = require("fs");
var q = require('q');
var path = require('path');
var findRemove = require('find-remove');
var _ = require('lodash');

var _opts = {
  paperSize: {format: "A4", orientation: 'portrait', margin: '1cm'},
  saveDir: path.join(__dirname, "pdfTemp"),
  idLength: 30,
  possibleIdChars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
};

function mergeOpts(newOpts) {
  if(newOpts){
    return _.merge({}, _opts, newOpts);
  } else {
    return _opts;
  }

}

function renderpdf(url, opts) {
  var deferred = q.defer();
  var page, fileName, ph, fullPath;

  opts = mergeOpts(opts);
  phantom.create(['--ignore-ssl-errors=yes'])
    .then(function (_ph) {
      ph = _ph;
      return ph.createPage()
    })
    .then(function (_page) {
      page = _page;
      return page.property("paperSize", opts.paperSize);
    })
    .then(function () {
      return page.open(url)
    })
    .then(function (status) {
      fileName = makeid(opts.idLength) + ".pdf";
      fullPath = opts.saveDir + "/" + fileName;
      return page.render(fullPath);
    })
    .then(function () {
      deferred.resolve(fullPath);
      ph.exit();
    })
    .catch(function (err) {
      deferred.reject(err);
      ph.exit();
    });

  return deferred.promise;
}

function renderFromHTML(htmlString, opts) {
  var deferred = q.defer();
  var page, fileName, ph, fullPath;

  opts = mergeOpts(opts);
  phantom.create(['--ignore-ssl-errors=yes'])
    .then(function (_ph) {
      ph = _ph;
      return ph.createPage()
    })
    .then(function (_page) {
      page = _page;
      return q.all([
        page.property("paperSize", opts.paperSize),
        page.property("content", htmlString)
      ])
    })
    .then(function (status) {
      fileName = makeid(opts.idLength) + ".pdf";
      fullPath = opts.saveDir + "/" + fileName;

      return qTimeout(2000);
    })
    .then(function () {
      return page.render(fullPath);
    })
    .then(function () {
      deferred.resolve(fullPath);
    })
    .catch(function (err) {
      deferred.reject(err);
    })
    .then(function () {
      ph.exit();
    });

  return deferred.promise;
}

function qTimeout(duration){
  var deferred = q.defer();

  setTimeout(deferred.resolve, duration);

  return deferred.promise;
}

function closure(fn) {
  var _arguments = arguments;
  delete arguments[0];
  return function () {
    fn.apply(_arguments);
  }
}

function cleanup(ageInSeconds) {
  return findRemove(_opts.saveDir, {age: {seconds: ageInSeconds}});
}

function makeid(strLength) {
  if (!strLength) strLength = 30;
  var text = "";
  var possible = _opts.possibleIdChars;

  for (var i = 0; i < strLength; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

module.exports = {
  renderPdf: renderpdf,
  cleanup: cleanup,
  opts: _opts,
  renderFromHTML: renderFromHTML
};
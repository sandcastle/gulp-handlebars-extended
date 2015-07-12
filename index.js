'use strict';
var path = require('path');
var through2 = require('through2');
var gutil = require('gulp-util');


var PLUGIN_NAME = 'gulp-handlebars-extended';

/**
 * Combined compile and render of handlebars files.
 */
module.exports = function(data, opts) {
    
  opts = opts || {};
  var handlebars = opts.handlebars || require('handlebars-extended');

  return through2.obj(function(file, enc, callback) {
      
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return callback();
    }

    var contents = file.contents.toString();
    try {   
      var compiled = handlebars.compile(contents, opts);      
      file.contents = new Buffer(compiled(data, opts));
      file.path = gutil.replaceExtension(file.path, '.html');
    }
    catch (err) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, err, {
        fileName: file.path
      }));
      return callback();
    }

    callback(null, file);
  });
};

/**
 * Compiles handlebars files and sets the file.compiled property
 * with the result. A separate call to render is required.
 */
module.exports.compile = function(opts){
  
  opts = opts || {};
  var handlebars = opts.handlebars || require('handlebars-extended');

  return through2.obj(function(file, enc, callback) {
      
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return callback();
    }

    var contents = file.contents.toString();
    try {   
      file.compiled = handlebars.compile(contents, opts);
    }
    catch (err) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, err, {
        fileName: file.path
      }));
      return callback();
    }

    callback(null, file);
  });
};

/**
 * Renders previously comipiled handlebars files.
 */
module.exports.render = function(data, opts){  
  return through2.obj(function(file, enc, callback) {
      
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return callback();
    }
    
    if (!file.compiled){
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'render called without, first calling compile'));
      return callback();
    }
    
    try {
      file.contents = new Buffer(file.compiled(data, opts));
      file.path = gutil.replaceExtension(file.path, '.html');    
      file.compiled = null;
    }
    catch (err) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, err, {
        fileName: file.path
      }));
      return callback();
    }
    
    callback(null, file);
  });
};

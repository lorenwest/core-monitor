// AppDevProbe.js (c) 2010-2014 Loren West and other contributors
// May be freely distributed under the MIT license.
// For further details and documentation:
// http://lorenwest.github.com/core-monitor
var Monitor = require('monitor'),
    Probe = Monitor.Probe,
    FileProbe = Monitor.FileProbe,
    ChildProcess = require('child_process');
    fs = require('fs'),
    logger = Monitor.getLogger('AppDevProbe');

/**
* This probe assists in monitor app deveopment
*
* @class AppDevProbe
* @constructor
*/
var AppDevProbe = Probe.extend({

  probeClass: 'AppDevProbe',

  // Called by Backbone.Model on object construction
  initialize: function(options){
    var t = this;
    t.set('validPaths', process.mainModule.paths);
    t.set('pathSep', require('path').sep);
  },

  /**
  * Verify if an NPM module exists
  *
  * @method verifyNPM_control
  * @param moduleName {String} Name of the module to verify
  * @param params.callback {function(error, verified)}
  */
  verifyNPM_control: function(moduleName, callback) {
    var command = 'npm --loglevel silent owner ls ' + moduleName;
    ChildProcess.exec(command, function(error) {
      if (error) {
        callback({err:'NOTFOUND'});
      }
      else {
        callback();
      }
    });
  },

  /**
  * Create a bootstrap application
  *
  * @method generateApp
  * @param params {Object} Input parameters (also template parameters)
  * @param params.appPath {String} Directory name to write the app to
  * @param params.appName {String} Application name
  * @param params.appDescription {String} Application description
  * @param params.shortAppName {String} Short application name (less -monitor)
  * @param params.callback {function(error)}
  */
  generateApp_control: function(params, callback) {
    var t = this,
        appPath = params.appPath;

    logger.info('generateApp', 'Generating new application into: ' + appPath);

    // Output the specified file from the template directory
    var outputFile = function(dirpath, file, callback1) {
      var templateFilePath = Path.join(__dirname, '../template/app', dirpath, file),
          outputFile = Path.join(appPath, dirpath, file);

      //Read the file into a template
      fs.readFile(templateFilePath, function(error, file) {
        if (error) {
          logger.error('generateApp.readFile', 'Couldn\'t read template file: ' + templateFilePath, error);
          return callback1(error);
        }

        // Now merge the template and write the file
        var template = new Template({text: file.toString(), watchFile:false});
        FS.writeFile(outputFile, template.apply(params), callback1);
      });
    };

    // Output an entire directory, and sub-directories
    var outputDir = function(dirpath, callback2) {


      // Make the directory
      var outPath = Path.join(appPath, dirpath);

      fs.mkdir(outPath, function(error) {

        // Exit early if the directory can't be created
        // including because it already exists.
        if (error) {
          var err = {code:error.code, msg: 'Cannot create directory: ' + outPath};
          logger.warn('generateApp', err);
          return callback2(err);
        }

        // Read the filenames in the template directory
        var templateDir = Path.join(__dirname, '../template/app', dirpath);
        fs.readdir(templateDir, function(error, files) {
          if (error) {
            return callback2(error);
          }

          // Call when done processing a file or directory
          var numFilesProcessed = 0;
          var errored = false;
          var whenDone = function(error) {
            if (errored) {
              return;
            }
            if (error) {
              errored = true;
              return callback2(error);
            }
            if (++numFilesProcessed === files.length) {
              return callback2();
            }
          };

          // Process each file in the template dir
          files.forEach(function(file) {
            var fullFile = Path.join(templateDir, file);
            fs.stat(fullFile, function(error, stat) {
              if (stat.isDirectory()) {
                // Go into it
                outputDir(Path.join(dirpath, file), whenDone);
              }
              else {
                outputFile(dirpath, file, whenDone);
              }
            });
          });
        });
      });
    };

    // Don't overwrite an existing app
    fs.stat(appPath, function(error, stat) {

      // Kick off output only if the appPath does NOT exist
      if (error && error.code === 'ENOENT') {
        return outputDir('/', callback);
      }

      // The appPath exists.  This would be a problem.
      var err = {code: 'EEXIST', msg: 'Not overwriting directory: ' + appPath};
      return callback(err);
    });
  }


});

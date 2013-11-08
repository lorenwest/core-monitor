// This is run when the app is loaded from node-monitor
(function(root){

  // Create a server, and expose this directory
  var Connect = require('connect'),
      FS = require('fs'),
      Path = require('path'),
      Static = Connect['static'](__dirname);

  // Load all probes found in the ./probe directory
  // This is synchronous because require() is synchronous
  try {
    FS.readdirSync(Path.join(__dirname, 'probe')).forEach(function(fileName) {
      if (fileName.substr(-3) === '.js') {
        require('./probe/' + fileName);
      }
    });
  } catch (e) {}

  // Export a middleware component
  var app = module.exports = function(request, response, next) {

    // Process dynamic app endpoints here
    if (request.url === '/status') {
      response.writeHead(200, {'Content-Type': 'text/plan'});
      return response.end('ok');
    }

    // Forward to the static endpoint, then to the next step
    // if the file isn't there.  The next step is a monitor page.
    return Static(request, response, next);
  }

}(this));

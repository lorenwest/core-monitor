// This is run when the app is loaded from node-monitor
(function(root){

  // Create a server, and expose this directory
  var Connect = require('connect');
  var Static = Connect['static'](__dirname);

  // Load server side probes here
  // require('./probe/   .js');

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

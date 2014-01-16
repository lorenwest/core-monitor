(function(root){

  // Module loading
  var Monitor = root.Monitor || require('monitor'),
      UI = Monitor.UI,
      Template = UI.Template,
      template = null,
      Backbone = Monitor.Backbone;

  // Define the app on first load
  UI.app.core = UI.app.core || {};

  /**
  * Sample view for the core application
  *
  * @class AppDevView
  * @extends Backbone.View
  * @method initialize
  * @param options {Object} View initialization options
  *     @param options.el {$Selector} The view container element (.nm-cv-viewport)
  *     @param options.pageView {PageView} The singleton web page view object
  *     @param options.component {Component} The containing component data model object
  *     @param options.componentView {ComponentView} The containing component view object
  *     @param options.viewOptions {Object} View options set by the view settings form
  *     @param options.monitor {Monitor} The monitor defined by the view.
  *            Generally not in a connected state until this.render() is called.
  *            Each view is given one monitor.  It can choose to use it or not,
  *            or it can choose to create multiple monitors if necessary.
  */
  var AppDevView = UI.app.core.AppDevView = Backbone.View.extend({

    // Define the view
    name: 'AppDevView',
    description: 'Node monitor application builder',
    icon: '',  // Add an image for the component picker: /image/my_image.jpg
    tags: ['Development', 'Utility'],  // Add your view to the categories listed in these tags

    // Event declarations
    events: {
      "click .nm-core-adv-generate"  : "generate"
    },

    // Called by the Backbone.View constructor
    initialize: function(options) {
      var t = this;
      t.options = options;

      // Build the templates
      if (!template) {
        template = Template.fromDOM('#nm-template-core-AppDevView');
      }

      // Call this to set the initial height/width to something
      // other than the size of the inner view elements.
      options.component.setDefaultSize({
        width: 400,
        height: 300
      });

      // Build the monitor
      t.options.monitor.set('probeClass', 'AppDevProbe');

    },

    // Called to render the intial HTML view state.  Can be called by
    // onChange() as a heavyweight
    render: function(heading, title, data) {
      var t = this,
          html = "<ul>";

      // Get the list of valid paths from the monitor
      var validPaths = t.options.monitor.get('validPaths');
      for (var i = 0; i < validPaths.length; i++) {
        html += '<li>' + validPaths[i] + '</li>';
      }
      html += '</ul><button id="generateApp">Generate App</button>';
      t.$el.addClass('modal-body').html(template.get('text'));

      // Render the view HTML here
      $('#generateApp').on('click', function() {
        var opts = {
          appPath: '/Users/loren/node_modules/blah-monitor',
          appName: 'blah-monitor',
          appDescription: 'Monitor for the blah package',
          shortAppName: 'blah'
        }
        t.options.monitor.control('generateApp', opts, function(error) {
          if (error) {
            return console.error('Error creating app: ', error);
          }
          console.log('App Created');
        });
      });
    },

    // Generate button
    generate: function() {
      var t = this;
      var appPath = $('.nm-core-adv-type name[app-type]').val();
      var appName = $('.nm-core-adv-name').val();
      alert("Value: " + appPath);
      return;
      var opts = {
        appPath: '/Users/loren/node_modules/blah-monitor',
        appName: 'blah-monitor',
        appDescription: 'Monitor for the blah package',
        shortAppName: 'blah'
      }
      t.options.monitor.control('generateApp', opts, function(error) {
        if (error) {
          return console.error('Error creating app: ', error);
        }
        console.log('App Created');
      });
    }

  });

}(this));

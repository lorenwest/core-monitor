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
    name: 'App Generator',
    description: 'Node monitor application builder',
    icon: '',  // Add an image for the component picker: /image/my_image.jpg
    tags: ['Development', 'Utility', 'Hidden'],  // Add your view to the categories listed in these tags

    // Event declarations
    events: {
      "click .nm-core-adv-generate"  : "generate",
      "click #nm-core-adv-rb1"       : "appButtonPressed",
      "click #nm-core-adv-rb2"       : "moduleButtonPressed"
    },

    appButtonPressed: function() {
      $("#nm-core-adv-nameHeading").text("Your Application Name");
    },

    moduleButtonPressed: function() {
      $("#nm-core-adv-nameHeading").text("Your NPM Module Name");
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
        height: 310
      });

      // Build the monitor
      t.options.monitor.set('probeClass', 'AppDevProbe');

    },

    // Called to render the intial HTML view state.  Can be called by
    // onChange() as a heavyweight
    render: function(heading, title, data) {
      var t = this;

      // Get the list of valid paths from the monitor
      t.$el.addClass('modal-body').html(template.get('text'));
      t.fillSelectOptions();
      $('.nm-core-adv-name').on('keyup', function() {t.fillSelectOptions();});

    },


    // Fill the dropdown selector, optionally appending the app name
    fillSelectOptions: function() {
      var t = this,
          validPaths = t.options.monitor.get('validPaths'),
          pathSep = t.options.monitor.get('pathSep'),
          appName = $('.nm-core-adv-name').val(),
          dest = $('.nm-core-adv-dest'),
          innerHtml = '',
          selectedIndex = dest[0].selectedIndex < 0 ? 0 : dest[0].selectedIndex;

      // Build the inner html
      for (var i = 0; i < validPaths.length; i++) {
        var fullPath = validPaths[i],
            displayPath = fullPath;
            pathParts = displayPath.split(pathSep),
            possibleExtractions = pathParts.length - 4;

        // Shorten the display path
        while (displayPath.length > 40 && possibleExtractions > 0) {
          pathParts[2] = '...';
          displayPath = pathParts.join(pathSep);
          pathParts.splice(2,1);
          possibleExtractions--;
        }

        // Add the normalized app name if present
        if (appName) {
          // Normalize the app name
          appName = appName.replace(/[^A-Za-z0-9_-]/g,'_').toLowerCase();
          fullPath += pathSep + appName + '-monitor';
          displayPath += pathSep + appName + '-monitor';
        }

        // Build the option element
        innerHtml += '<option value="' + fullPath + '">' + displayPath + '</option>';
      }

      // Set the html
      dest.html(innerHtml);

      // Set the selected index if valid
      dest[0].selectedIndex = selectedIndex;

      // Disable the generate button if no app name
      $('.nm-core-adv-generate').attr('disabled', appName ? false : true);
    },

    // Generate button
    generate: function() {
      var t = this,
          dest = $('.nm-core-adv-dest'),
          isNpmModule = $('#nm-core-adv-rb2').attr('checked'),
          selectedIndex = dest[0].selectedIndex < 0 ? 0 : dest[0].selectedIndex,
          allOptions = $('.nm-core-adv-dest option'),
          appPath = $(allOptions[selectedIndex]).val(),
          displayName = $('.nm-core-adv-name').val(),
          shortAppName = displayName.replace(/[^A-Za-z0-9_-]/g,'_').toLowerCase(),
          appName = shortAppName + '-monitor';

      // Determine if this is an NPM module or local app
      var opts = {
        appPath: appPath,
        appName: appName,
        appDescription: 'Monitor for the ' + displayName + (isNpmModule ? ' module' : ' application'),
        shortAppName: shortAppName
      }
      t.options.monitor.control('generateApp', opts, function(error) {
        if (error) {
          alert('Error creating app:\n' + JSON.stringify(error));
          return;
        }
        alert('App created in:\n' + appPath);
      });
    }

  });

}(this));

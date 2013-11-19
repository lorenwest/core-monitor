// LogViewer.js (c) 2010-2013 Loren West and other contributors
// May be freely distributed under the MIT license.
// For further details and documentation:
// http://lorenwest.github.com/core-monitor
(function(root){

  // Module loading
  var Monitor = root.Monitor || require('monitor-dashboard'),
      logger = Monitor.getLogger('LogViewer'),
      UI = Monitor.UI,
      Backbone = Monitor.Backbone,
      core = UI.app.core = UI.app.core || {},
      _ = Monitor._;

  /**
  * A viewer for log statements
  *
  * @class LogViewer
  * @extends Backbone.View
  * @constructor
  * @param options {Object} View initialization options (See others in Backbone.View)
  */
  var LogViewer = core.LogViewer = Backbone.View.extend({

    // Define the view
    name: 'Log Viewer',
    tags: ['Utility'],
    icon: 'image/LogViewer.png',
    description: 'A listener and viewer for application logs',
    website: 'http://lorenwest.github.com/core-monitor',
    defaultOptions: {
      title: 'Log Viewer',
      background: true
    },

    // Constructor
    initialize: function(options) {
      var t = this;
      t.options = options;
      t.monitor = options.monitor;
      options.component.setDefaultSize({
        width: 600,
        height: 400
      });

      // Set default monitor options
      if (!t.monitor.get('probeClass')) {
        t.monitor.set({
          probeClass: 'Log',
          initParams: {
            pattern: "{trace,debug,info,warn,error,fatal}.*"
          }
        });
      }

      // Set up logging
      t.logCtxt = t.monitor.get('initParams');
      logger.info('init', t.logCtxt);
    },

    // Process output from the backend
    _onChange: function(monitorEvent){
      var t = this,
          bundle = t.monitor.get('bundle');

      logger.info('onChange', t.logCtxt, bundle);
      if (bundle) {
        bundle.forEach(function(logItem) {
          t.lineOut(logItem);
        });
      }
    },

    render: function() {
      var t = this;

      // Create the monitor in the loading state
      t.body = $('<ul class="nm-core-lv"></ul>').appendTo(t.$el);

      // Listen for monitor events
      t.monitor.on('change', t._onChange, t);
    },

    events: {
      "click .output_line":    "onOpenClose"
    },

    onOpenClose: function(e) {
      var t = this,
          elem = $(e.currentTarget);

      elem.toggleClass('opened');
      t.displayLine(elem);
    },

    // Output a log line to the viewer
    lineOut: function(logItem){
      var t = this;

      // Generate a line to output to
      lastLine = $('<li class="output_line"><i class="icon-caret-right"></i><span class="nm-core-lv-out"></span></li>')
        .data('item', logItem)
        .appendTo(t.body);
      t.displayLine(lastLine);
      t.viewLastLine();
    },

    // Display an existing line
    displayLine: function(elem){
      var t = this,
          logItem = elem.data('item'),
          isOpen = elem.hasClass('opened'),
          time = new Date(logItem[0]),
          log = {
            time: time,
            type: logItem[1],
            module: logItem[2],
            name: logItem[3],
            args: logItem.slice(4)
          },
          shortTime = t.digits(time.getHours(), 2) + ":" +
                      t.digits(time.getMinutes(), 2) + ':' +
                      t.digits(time.getSeconds(), 2) + '.' +
                      t.digits(time.getMilliseconds(), 3);

      // Build the line to output
      var line = shortTime + ' [' + log.type + '] ' + log.module + '.' + log.name,
          argStr;
      if (isOpen) {
        line += '\n  ' + logItem[0];
        log.args.forEach(function(arg) {
          if (!arg) {return;} // Sometimes last arg is undefined
          try {
            argStr = JSON.stringify(arg, null, 2);
          } catch(e) {
            argStr = Monitor.stringify(arg);
          }
          line += '\n  ' + argStr.replace(/\n/g,'\n  ');
        });
      }
      else {
        try {
          argStr = JSON.stringify(log.args);
        } catch(e) {
          argStr = Monitor.stringify(log.args);
        }
        line += ' ' + argStr.replace(/\r*\n\s*/g,' ');
      }

      // Display the open/close caret, and the output
      elem.find('i').attr('class', 'icon-caret-' + (isOpen ? 'down' : 'right'))
      elem.find('.nm-core-lv-out').text(line);
    },

    // Format an integer into a specified number of digits, with leading zeros
    digits: function(number, digits) {
      var ret = '' + number,
          len = ret.length;
      if (len == digits) {
        return ret;
      }
      else if (len < digits) {
        return '0000'.substr(0, digits - len) + ret;
      }
      return ret.substr(0, digits);
    },

    // Scroll the view to the last line
    //TODO: Stabilize output if they've manually scrolled (unless they're at the bottom)
    viewLastLine: function(){
      var t = this;
      t.$el.scrollTop(1000000).scrollLeft(0);
    }

  });

  // Custom settings form for the Text view
  LogViewer.SettingsView = Backbone.View.extend({

    render: function() {
      var t = this;
      t.monitor = t.options.monitor;
      t.initParams = t.monitor.get('initParams');
      t.$el.html('' +
        '<div class="nm-core-probe-input">' +
          '<label>Server</label>' +
          '<div class="server nm-core-probe-sel"></div>' +
          '<label>Match Pattern (see Log documentation)</label>' +
          '<input class="nm-core-lv-pattern monospace-font" type="text"/>' +
        '</div>');

      // Append a server picker
      t.serverPicker = new UI.MonitorPicker.ServerView({
        el: t.$el.find('.server'),
        model: t.monitor
      });
      t.serverPicker.render();

      // Place configuration elements
      t.$el.find('.nm-core-lv-pattern').val(t.initParams.pattern);

    },

    events: {
      "change *"  : "onChange"
    },

    onChange: function() {
      var t = this;
      t.initParams.pattern = t.$('.nm-core-lv-pattern').val();
    }

  });

}(this));

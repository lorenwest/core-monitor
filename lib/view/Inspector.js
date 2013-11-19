// Inspector.js (c) 2010-2013 Loren West and other contributors
// May be freely distributed under the MIT license.
// For further details and documentation:
// http://lorenwest.github.com/core-monitor
(function(root){

  // Module loading
  var Monitor = root.Monitor || require('monitor-dashboard'),
      UI = Monitor.UI,
      Backbone = Monitor.Backbone,
      _ = Monitor._;

  /**
  * View the probe JSON
  *
  * @class Inspector
  * @extends Backbone.View
  * @constructor
  * @param options {Object} View initialization options (See others in Backbone.View)
  */
  var Inspector = UI.app.core.Inspector = Backbone.View.extend({

    // Define the view
    name: 'Object Inspector',
    tags: ['Utility'],
    icon: 'image/ObjectInspector.png',
    description: 'Inspects variables and expressions in the browser or Node.js process',
    defaultOptions: {
      title: 'Object Inspector',
      background: true
    },

    initialize: function(options) {
      var t = this;
      // Initialize a blank monitor
      t.monitor = options.monitor;
      t.component = options.component;
      if (!t.monitor.get('probeClass')) {
        t.monitor.set({
          probeClass: 'Inspect',
          initParams: {
            key: Monitor.commonJS ? 'global' : 'window',
            depth: Monitor.commonJS ? 2 : 1
          }
        });
      }
      options.component.setDefaultSize({
        width: 350,
        height: 400
      });
    },

    events: {
    },

    render: function() {
      var t = this;

      // Clear out any prior JSON
      if (t.jsonView) {
        t.jsonView.remove();
        t.jsonView = null;
      }
      t.outerView = t.$el.html('<div class="nm-core-inspector"></div>')
        .find('.nm-core-inspector');
      t.jsonView = new UI.JsonView({
        heading: "INSPECTING: " + t.monitor.get('initParams').key,
        model: t.monitor.get('value'),
        closedOnInit: true
      });
      t.jsonView.render();
      t.outerView.append(t.jsonView.$el);

      // Re-render on change
      t.resetData = function(){
        t.jsonView.setData(t.monitor.get('value'));
      };
      t.monitor.on('change:value', t.resetData, t);
    },

    destroy: function() {
      var t = this;
      t.monitor.off('change:value', t.resetData, t);
    }

  });

  // Custom settings form
  Inspector.SettingsView = Backbone.View.extend({

    render: function() {
      var t = this;
      t.monitor = t.options.monitor;
      t.$el.html('' +
        '<div class="nm-core-inspector-input">' +
          '<label>Server</label>' +
          '<div class="server nm-core-probe-sel"></div>' +
          '<label>Expression</label>' +
          '<input data-monitor-param="key" class="nm-core-inspector-expression monospace-font" title="Enter a variable name or expression" type="text"/>' +
        '</div>' +
        '<div class="nm-core-inspector-depthblock">' +
          '<label>JSON Depth</label>' +
          '<input data-monitor-param="depth" class="nm-core-inspector-depth" type="text"/>' +
        '</div>');

      // Append a server picker
      t.serverPicker = new UI.MonitorPicker.ServerView({
        el: t.$el.find('.server'),
        model: t.monitor
      });
      t.serverPicker.render();
    }

  });

}(this));

// Probe.js (c) 2010-2013 Loren West and other contributors
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
  * @class Probe
  * @extends Backbone.View
  * @constructor
  * @param options {Object} View initialization options (See others in Backbone.View)
  */
  var Probe= UI.app.core.Probe= Backbone.View.extend({

    // Define the view
    name: 'Probe Viewer',
    icon: 'image/ProbeViewer.png',
    description: 'Displays the raw probe JSON',
    defaultOptions: {
      title: 'Probe Viewer',
      background: true
    },

    initialize: function(options) {
      var t = this;
      t.monitor = options.monitor;
      t.component = options.component;
      options.component.setDefaultSize({
        width: 300,
        height: 300
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
      t.outerView = t.$el.html('<div class="nm-core-probe"></div>')
        .find('.nm-core-probe');

      t.jsonView = new UI.JsonView({model: t.monitor, closedOnInit:true});
      t.jsonView.render();
      t.outerView.append(t.jsonView.$el);

    }

  });

  // Custom settings form
  Probe.SettingsView = Backbone.View.extend({

    initialize: function(options) {
      var t = this;
    },

    events: {
    },

    render: function() {
      var t = this;
      t.monitor = t.options.monitor;

      // Append a monitor picker
      t.monitorPicker = new UI.MonitorPicker({
        el: t.$el,
        model: t.monitor
      });
      t.monitorPicker.render();
    },

  });

}(this));

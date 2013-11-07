// LineChart.js (c) 2010-2013 Loren West and other contributors
// May be freely distributed under the MIT license.
// For further details and documentation:
// http://lorenwest.github.com/core-monitor
(function(root){

  // Module loading
  var Monitor = root.Monitor || require('monitor-dashboard'),
      UI = Monitor.UI,
      core = UI.app.core = UI.app.core || {},
      Chart = core.Chart,
      Backbone = Monitor.Backbone,
      _ = Monitor._;

  /**
  * A line chart view
  *
  * @class LineChart
  * @extends Backbone.View
  * @constructor
  * @param options {Object} View initialization options (See others in Backbone.View)
  *     @param options.label='Chart' {String} The component label
  *     @param options.icon='icon-bar-chart' {String} The icon class name
  *     @param options.highcharts = {} {Object} Highcharts chart configuration object
  */
  var LineChart = core.LineChart = Chart.extend({

    // Define the view
    name: 'LineChart',
    tags: ['Chart', 'Time Series', 'Real Time'],
    icon: 'image/LineChart.png',
    description: 'A line chart',
    defaultOptions: {
      title: 'Line Chart',
      highcharts: {
        chart: {
          type: 'line',
          margin: null
        },
        legend: {
          enabled: false
        },
        xAxis: {
          title: {
            text: 'Values'
          },
          labels: {
            enabled:true
          }
        },
        yAxis: {
          title: {
            text: ''
          },
          labels: {
            enabled:true
          }
        },
        plotOptions: {
          line: {
          }
        },
        series: [{
          name: 'value',
          data: [1,0,4,10,3,8,7,7,3,0,5]
        }]
      }
    },

    initialize: function(options) {
      var t = this;
      Chart.prototype.initialize.apply(t, arguments);
    }

  });

  // This settings form is inherited by all charts.
  LineChart.SettingsView = Chart.SettingsView.extend({

    // Extend for local events
    events: _.extend({}, Chart.SettingsView.prototype.events, {
      "change *"  : "onChange"
    }),

    render: function() {
      var t = this;

      // Call parent render to set up dom
      Chart.SettingsView.prototype.render.apply(t, arguments);

      // Set my title & HTML
      $('.core-chart-settings').append('' +
        '<div class="core-gauge-label">' +
	  '<label>X Axis Label</label>' +
	  '<input class="xlabel" type="text"/>' +
        '</div>' +
        '<div class="core-gauge-label-right">' +
	  '<label>Y Axis Label</label>' +
	  '<input class="ylabel" type="text"/>' +
        '</div>'
      );

      // Set initial field values
      t.xlabel = t.$('.xlabel').val(t.hc.xAxis.title.text);
      t.ylabel = t.$('.ylabel').val(t.hc.yAxis.title.text);
    },

    onChange: function() {
      var t = this;
      t.hc.xAxis.title.text = t.xlabel.val();
      t.hc.yAxis.title.text = t.ylabel.val();
    }
  });

}(this));

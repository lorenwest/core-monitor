// Gauge.js (c) 2010-2013 Loren West and other contributors
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
  * A gague dial
  *
  * @class Gauge
  * @extends Backbone.View
  * @constructor
  * @param options {Object} View initialization options (See others in Backbone.View)
  *     @param options.label='Chart' {String} The component label
  *     @param options.icon='icon-bar-chart' {String} The icon class name
  *     @param options.highcharts = {} {Object} Highcharts chart configuration object
  */
  var Gauge = core.Gauge = Chart.extend({

    // Define the view
    name: 'Gauge',
    tags: ['Chart', 'Real Time'],
    icon: 'image/Gauge.png',
    description: 'A gauge for displaying a single value change over time',
    defaultOptions: {
      title: 'Gauge',
      highcharts: {
        chart: {
          type: 'gauge',
          margin: 0,
          plotBackgroundColor: 'transparent',
          plotBorderWidth: 0,
          plotShadow: false
        },

	pane: {
	  startAngle: -55,
	  endAngle: 55,
	  center: ['50%', '140%'],
	  size: '250%'
	},

        plotOptions: {
          gauge: {
            dial: {
	      radius: '100%',
              backgroundColor: 'rgba(200,183,155,1)'
            },
            pivot: {
              backgroundColor: 'rgba(200,183,155,1)'
            }
          }
        },

        yAxis: {
          labels: {
            distance: -22,
	    style: {
	      fontSize: '12px'
	    },
          },
          min: 180,
          max: 230,
          tickInterval: 10,

          lineWidth: 0,
          showFirstLabel: true,
          showLastLabel: true,
          minorTickInterval: 'auto',
          minorTickWidth: 1,
          minorTickLength: 5,
          minorTickPosition: 'inside',
          minorGridLineWidth: 0,
          minorTickColor: 'rgba(200,183,155,1)',
          tickWidth: 2,
          tickPosition: 'inside',
          tickLength: 10,
          tickColor: 'rgba(200,183,155,1)',
          title: {
	    text: 'Requests<br>Per Second',
          }
        },
        series: [{
	  name: "value",
	  data: [214]
        }]
      }
    },

    initialize: function(options) {
      var t = this;
      options.component.setDefaultSize({
        width: 220,
        height: 100
      });
      core.Chart.prototype.initialize.apply(t, arguments);

      // See how to update realtime
      /*
      setInterval(function() {
	var num = (Math.random() * 50) + 180;
	console.log("Setting number to: " + num);
	var value = t.chart.get("value");
	value.update(num);
      }, 1000);
      */
    }

  });

  // This settings form is inherited by all charts.
  Gauge.SettingsView = Chart.SettingsView.extend({

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
	  '<label>Gauge Label</label>' +
	  '<input class="ylabel" type="text"/>' +
        '</div>' +
        '<div class="core-gauge-minmax">' +
	  '<label>Min Value</label>' +
	  '<input class="min-value" type="text"/>' +
        '</div>' +
        '<div class="core-gauge-minmax">' +
	  '<label>Max Value</label>' +
	  '<input class="max-value" type="text"/>' +
        '</div>' +
        '<div class="core-gauge-minmax">' +
	  '<label>Interval</label>' +
	  '<input class="tick-value" type="text"/>' +
        '</div>'
      );

      // Set initial field values
      t.label = t.$('.ylabel').val(t.hc.yAxis.title.text);
      t.min = t.$('.min-value').val(t.hc.yAxis.min);
      t.max = t.$('.max-value').val(t.hc.yAxis.max);
      t.tick = t.$('.tick-value').val(t.hc.yAxis.tickInterval);

    },

    onChange: function() {
      var t = this;
      t.hc.yAxis.title.text = t.label.val();
      t.hc.yAxis.min = parseInt(t.min.val());
      t.hc.yAxis.max = parseInt(t.max.val());
      t.hc.yAxis.tickInterval = parseInt(t.tick.val());
    }
  });

}(this));

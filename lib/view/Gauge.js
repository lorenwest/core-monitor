// Gauge.js (c) 2010-2013 Loren West and other contributors
// May be freely distributed under the MIT license.
// For further details and documentation:
// http://lorenwest.github.com/core-monitor
(function(root){

  // Module loading
  var Monitor = root.Monitor || require('monitor'),
      UI = Monitor.UI,
      core = UI.app.core = UI.app.core || {},
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
  *     @param options.config = {} {Object} Highcharts chart configuration object
  */
  var Gauge = core.Gauge = core.Chart.extend({

    // Define the view
    name: 'Gauge',
    icon: 'image/Button.png',
    description: 'A gauge for displaying a single value change over time',
    defaultOptions: {
      title: 'Gauge',
      config: {
        chart: {
          type: 'gauge',
          margin: 0,
          plotBackgroundColor: 'transparent',
          plotBorderWidth: 0,
          plotShadow: false
        },

	pane: {
	  backgroundColor: 'blue',
	  startAngle: -55,
	  endAngle: 55,
	  center: ['50%', '140%'],
	  size: '250%'
	},

        plotOptions: {
          gauge: {
            dataLabels: {
	      enabled: false
	    },
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
            distance: -18,
	    style: {
	      fontSize: '12px'
	    },
          },
          min: 180,
          max: 230,
	  pane: 0,

          lineWidth: 0,
          showFirstLabel: true,
          showLastLabel: true,
          minorTickInterval: 'auto',
          minorTickWidth: 1,
          minorTickLength: 5,
          minorTickPosition: 'inside',
          minorGridLineWidth: 0,
          minorTickColor: 'rgba(200,183,155,1)',
          tickInterval: 10,
          tickWidth: 2,
          tickPosition: 'inside',
          tickLength: 10,
          tickColor: 'rgba(200,183,155,1)',
          title: {
	    text: 'VU<br/><span style="font-size:8px">Channel A</span>',
          }
        }
      }
    },

    initialize: function(options) {
      var t = this;
      options.component.setDefaultSize({
        width: 220,
        height: 100
      });
      core.Chart.prototype.initialize.apply(t, arguments);
    },

    // Return the initial chart data series
    getInitialSeries: function() {
      var t = this,
        series = [{name: 'Value', yAxis: 0, data: [213]}];
      return series;
    }

  });

}(this));

// SparkLine.js (c) 2010-2013 Loren West and other contributors
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
  * A sparkline view
  *
  * @class SparkLine
  * @extends Backbone.View
  * @constructor
  * @param options {Object} View initialization options (See others in Backbone.View)
  *     @param options.label='Chart' {String} The component label
  *     @param options.icon='icon-bar-chart' {String} The icon class name
  *     @param options.highcharts = {} {Object} Highcharts chart configuration object
  */
  var SparkLine = core.SparkLine = Chart.extend({

    // Define the view
    name: 'SparkLine',
    tags: ['Chart', 'Time Series', 'Real Time'],
    icon: 'image/SparkLine.png',
    description: 'Displays time-series data in a compact form',
    defaultOptions: {
      title: 'Spark Line',
      highcharts: {
        chart: {
          type: 'line',
          marginTop: 0,
          marginBottom: 0,
          marginRight: 5
        },
        legend: {
          enabled: false
        },
        xAxis: {
          lineWidth: 0,
          gridLineWidth: 0,
          tickWidth: 0,
          labels: {
            enabled:false
          }
        },
        yAxis: {
          gridLineWidth: 0,
          tickWidth: 0,
          maxPadding:0,
          minPadding:0,
          endOnTick:true,
          title: {
            text: ''
          },
          labels: {
            enabled:false
          }
        },
        plotOptions: {
          line: {
            color: 'rgba(200,183,155,1)',
            marker: {
              enabled: false
            }
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
      options.component.setDefaultSize({
        width: 240,
        height: 80
      });
      Chart.prototype.initialize.apply(t, arguments);
    }

  });

}(this));

// SparkLine.js (c) 2010-2013 Loren West and other contributors
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
  * A sparkline view
  *
  * @class SparkLine
  * @extends Backbone.View
  * @constructor
  * @param options {Object} View initialization options (See others in Backbone.View)
  *     @param options.label='Chart' {String} The component label
  *     @param options.icon='icon-bar-chart' {String} The icon class name
  *     @param options.config = {} {Object} Highcharts chart configuration object
  */
  var SparkLine = core.SparkLine = core.Chart.extend({

    // Define the view
    name: 'SparkLine',
    tags: ['Chart', 'Time Series', 'Real Time'],
    icon: 'image/SparkLine.png',
    description: 'Displays time-series data in a compact form',
    defaultOptions: {
      title: 'Spark Line',
      config: {
        chart: {
          type: 'line',
          margin: 0
        },
        legend: {
          enabled: false
        },
        xAxis: {
          lineWidth: 0,
          gridLineWidth: 0,
          tickWidth: 0,
          title: '',
          maxPadding:0,
          minPadding:0,
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
          title: '',
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
        }
      }
    },

    initialize: function(options) {
      var t = this;
      options.component.setDefaultSize({
        width: 240,
        height: 80
      });
      core.Chart.prototype.initialize.apply(t, arguments);
    },

    // Return the initial chart data series
    getInitialSeries: function() {
      var t = this,
          series = [];

      // Push some initial data
      series.push({name: 'value', data: [1,0,4,10,3,8,7,7,3,0,5]});

      return series;
    }

  });

}(this));

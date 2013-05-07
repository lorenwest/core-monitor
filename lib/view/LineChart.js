// LineChart.js (c) 2010-2013 Loren West and other contributors
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
  * A line chart view
  *
  * @class LineChart
  * @extends Backbone.View
  * @constructor
  * @param options {Object} View initialization options (See others in Backbone.View)
  *     @param options.label='Chart' {String} The component label
  *     @param options.icon='icon-bar-chart' {String} The icon class name
  *     @param options.config = {} {Object} Highcharts chart configuration object
  */
  var LineChart = core.LineChart = core.Chart.extend({

    // Define the view
    name: 'LineChart',
    icon: 'image/Button.png',
    description: 'A line chart',
    defaultOptions: {
      title: 'Line Chart',
      config: {
        chart: {
          type: 'line',
          margin: null
        },
        xAxis: {
        },
        yAxis: {
        },
        plotOptions: {
          line: {
            color: 'rgba(200,183,155,1)'
          }
        }
      }
    },

    initialize: function(options) {
      var t = this;
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

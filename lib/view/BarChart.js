// BarChart.js (c) 2010-2013 Loren West and other contributors
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
  * A bar chart view
  *
  * @class BarChart
  * @extends Backbone.View
  * @constructor
  * @param options {Object} View initialization options (See others in Backbone.View)
  *     @param options.label='Chart' {String} The component label
  *     @param options.icon='icon-bar-chart' {String} The icon class name
  *     @param options.config = {} {Object} Highcharts chart configuration object
  */
  var BarChart = core.BarChart = core.Chart.extend({

    // Define the view
    name: 'BarChart',
    tags: ['Chart'],
    icon: 'image/BarChart.png',
    description: 'A bar chart',
    defaultOptions: {
      title: 'Bar Chart',
      config: {
        chart: {
          type: 'column'
        },
        legend: {
          enabled: true
        },
        xxAxis: {
          lineWidth: 0,
          gridLineWidth: 0,
          tickWidth: 0,
          labels: {
            enabled:true
          }
        },
        xyAxis: {
          gridLineWidth: 0,
          tickWidth: 0,
          maxPadding:0,
          minPadding:0,
          endOnTick:true,
          title: '',
          labels: {
            enabled:true
          }
        },
        plotOptions: {
          bar: {
            color: 'rgba(200,183,155,1)'
          },
          column: {
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

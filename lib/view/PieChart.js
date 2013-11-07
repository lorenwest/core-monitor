// PieChart.js (c) 2010-2013 Loren West and other contributors
// May be freely distributed under the MIT license.
// For further details and documentation:
// http://lorenwest.github.com/core-monitor
(function(root){

  // Module loading
  var Monitor = root.Monitor || require('monitor-dashboard'),
      UI = Monitor.UI,
      core = UI.app.core = UI.app.core || {},
      Backbone = Monitor.Backbone,
      _ = Monitor._;

  /**
  * A par chart view
  *
  * @class PieChart
  * @extends Backbone.View
  * @constructor
  * @param options {Object} View initialization options (See others in Backbone.View)
  *     @param options.label='Chart' {String} The component label
  *     @param options.icon='icon-bar-chart' {String} The icon class name
  *     @param options.highcharts = {} {Object} Highcharts chart configuration object
  */
  var PieChart = core.PieChart = core.Chart.extend({

    // Define the view
    name: 'PieChart',
    tags: ['Chart'],
    icon: 'image/PieChart.png',
    description: 'A pie chart',
    defaultOptions: {
      title: 'Pie Chart',
      highcharts: {
        chart: {
          type: 'pie'
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
          title: '',
          labels: {
            enabled:false
          }
        },
        plotOptions: {
          pie: {
            color: 'rgba(200,183,155,1)',
            dataLabels: {
              color: 'rgba(200,183,155,1)'
            },
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
      core.Chart.prototype.initialize.apply(t, arguments);
    }

  });

}(this));

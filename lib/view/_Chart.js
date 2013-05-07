// Chart.js (c) 2010-2013 Loren West and other contributors
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

  var HIGHCHARTS_OPTS = {
    chart: {
      backgroundColor: 'transparent'
    },
    title: {
      text: ''
    },
    legend: {
      title: {
        style: {
          color: 'rgba(235,122,109,0.75)'
        }
      }
    },
    credits:{
      enabled:false
    },
    xAxis: {
      title: {
        style: {
          color: 'rgba(235,122,109,0.75)'
        }
      },
      labels: {
        style: {
          color: 'rgba(200,183,155,1)'
        }
      }
    },
    yAxis: {
      title: {
        style: {
          color: 'rgba(235,122,109,0.75)'
        }
      },
      labels: {
        style: {
          color: 'rgba(200,183,155,1)'
        }
      }
    }
  };

  /**
  * Foundation for rendering a Highcharts chart
  *
  * This provides a common interface for views representing Highcharts charts.
  *
  * @class Chart
  * @extends Backbone.View
  * @constructor
  * @param options {Object} View initialization options (See others in Backbone.View)
  *     @param options.label='Chart' {String} The component label
  *     @param options.icon='icon-bar-chart' {String} The icon class name
  *     @param options.config = {} {Object} Highcharts chart configuration object
  */
  var Chart = core.Chart = Backbone.View.extend({

    // Define the view
    defaultOptions: {
      label: 'Chart',
      icon: 'icon-bar-chart',
      config: {}
    },

    initialize: function(options) {
      var t = this;

      // Set the default highcharts options
      if (!Highcharts.monitorOptionsSet) {
        Highcharts.setOptions(HIGHCHARTS_OPTS);
        Highcharts.monitorOptionsSet = true;
      }

      t.viewOptions = t.options.viewOptions;
      t.config = t.viewOptions.get('config') || {};
      options.component.setDefaultSize({
        width: 300,
        height: 300
      });
    },

    events: {
    },

    render: function() {
      var t = this,
          config = Monitor.deepCopy(t.config);
      config.series = t.getInitialSeries();
      config.chart.renderTo = t.$el[0];
      t.chart = new Highcharts.Chart(config);


      // Resize the chart on component resize`
      t.on('resize', function() {
        t.chart.setSize(t.$el.width(), t.$el.height(), false);
      });
    },

    // This method must be overridden by sub-views to return
    // the data series to use on initial chart construction
    getInitialSeries: function() {
      return [];
    }

  });

}(this));

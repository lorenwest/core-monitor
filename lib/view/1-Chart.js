// Chart.js (c) 2010-2013 Loren West and other contributors
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

  var HIGHCHARTS_OPTS = {
    chart: {
      backgroundColor: 'transparent'
    },
    colors: [
      'rgb(200,183,155)',
      'rgb(255,100,100)',
      'rgb(100,100,255)',
      'rgb(0,200,0)',
      'rgb(200,0,50,)',
      'rgb(200,100,255)',
      'rgb(255,255,0)',
      'rgb(0,150,150)',
      'rgb(175,175,175)',
      'rgb(255,0,255)'
    ],
    title: {
      text: ''
    },
    pane: {
      background: {
        backgroundColor: 'transparent'
      }
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
  *     @param options.highcharts = {} {Object} Highcharts chart configuration object
  */
  var Chart = core.Chart = Backbone.View.extend({

    // Define the view
    defaultOptions: {
      label: 'Chart',
      icon: 'icon-bar-chart',
      highcharts: {}
    },

    initialize: function(options) {
      var t = this;

      // Set the default highcharts options
      if (!Highcharts.monitorOptionsSet) {
        Highcharts.setOptions(HIGHCHARTS_OPTS);
        Highcharts.monitorOptionsSet = true;
      }

      t.viewOptions = t.options.viewOptions;
      t.hc = t.viewOptions.get('highcharts') || {};
      options.component.setDefaultSize({
        width: 300,
        height: 300
      });
    },

    events: {
    },

    render: function() {
      var t = this,
          hc = Monitor.deepCopy(t.hc, 10);
      hc.chart.renderTo = t.$el[0];
      t.chart = new Highcharts.Chart(hc);

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

  // This settings form is inherited by all charts.
  Chart.SettingsView = Backbone.View.extend({

    // Extend for local events
    events: {
      "change .core-chart-data"  : "onChartDataChange",
      "change"                   : "onInputChange"
    },

    render: function() {
      var t = this;

      t.hc = t.model.get('highcharts');

      // Place template HTML
      t.$el.html('' +
        '<div class="core-chart-settings clearfix"></div>' +
        '<div class="nm-core-chart-monitor"></div>' +
        '<label title="Enter the data series JSON.  See Highcharts documentation for the format">Data series</label>' +
        '<textarea class="monospace-font core-chart-data"></textarea>'
      );

      // Attach the monitor picker
      t.monitorPicker = new UI.MonitorPicker({
        el: t.$('.nm-core-chart-monitor'),
        model: t.options.monitor
      });
      t.monitorPicker.render();

      // Fill the data series
      t.series = t.$('.core-chart-data').val(JSON.stringify(t.hc.series));

      // Re-render on view-source change (view-source is in parent container)
      // This removes prior bindings from earlier renders
      var editBox = $('.nm-cs-source-edit')
      editBox.off('change').on('change', function(e) {
        try {
          // Let container do error handling
          t.model.set('highcharts', JSON.parse(editBox.val()).viewOptions.highcharts);
          t.onInputChange();
        } catch (e) {}
      });

      // Attach all color pickers after the derived render occurs
      t.$('.colorPicker').miniColors({
        opacity: true
      });

    },

    onChartDataChange: function() {
      var t = this,
          val = t.series.val();

      // TODO: See if this is a function

      // Parse as JSON
      try {
        var data = JSON.parse(val);
      }
      catch (e) {
        alert('JSON parse error');
        return;
      }
      if (!_.isArray(data)) {
        alert('Does not parse as an array');
        return;
      };

      // Set the new series data
      t.hc.series = data;
    },

    onInputChange: function() {
      var t = this;

      // Give sub-views a chance to change their configs, then re-render
      setTimeout(function(){
        t.options.componentView.render();
      },0);
    }

  });

}(this));

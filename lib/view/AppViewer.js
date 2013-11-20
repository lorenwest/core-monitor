// AppViewer.js (c) 2010-2013 Loren West and other contributors
// May be freely distributed under the MIT license.
// For further details and documentation:
// http://lorenwest.github.com/core-monitor
(function(root){

  // Module loading
  var Monitor = root.Monitor || require('monitor-dashboard'),
      logger = Monitor.getLogger('AppViewer'),
      UI = Monitor.UI,
      Template = UI.Template,
      Backbone = Monitor.Backbone,
      core = UI.app.core = UI.app.core || {},
      Chart = core.Chart,
      template = null,
      _ = Monitor._;

  // Constants
  var INFO_MAP = {
    'Process Title': 'title',
    'Executable Path': 'execPath',
    'Executable Args': 'argv',
    'Working Directory': 'cwd',
    'Process ENV': 'env',
    'Process ID': 'pid',
    'Process Uptime' : 'uptime',
    'Heap Total': 'heapTotal',
    'Heap Used ': 'heapUsed',
    'RSS Space ': 'rss',
    'Host Name' : 'hostname',
    'OS Type' : 'type',
    'OS Release' : 'release',
    'Total Memory' : 'totalmem',
    'Free  Memory' : 'freemem',
    'Load Averages 1/5/15' : 'loadavg',
    'CPU Info' : 'cpus',
    'Node Platform': 'platform',
    'Node Versions': 'versions'
  };

  /**
  * A viewer for log statements
  *
  * @class AppViewer
  * @extends Backbone.View
  * @constructor
  * @param options {Object} View initialization options (See others in Backbone.View)
  */
  var AppViewer = core.AppViewer = Backbone.View.extend({

    // Define the view
    name: 'App Viewer',
    tags: ['Utility', 'Real Time'],
    icon: 'image/AppViewer.png',
    description: 'A Node.JS application process viewer',
    website: 'http://lorenwest.github.com/core-monitor',
    defaultOptions: {
      animation: true,
      background: true
    },

    // Constructor
    initialize: function(options) {
      var t = this;
      t.options = options;
      t.viewOptions = options.viewOptions;
      t.monitor = options.monitor;
      options.component.setDefaultSize({width: 616, height: 616});
      Chart.prototype.initialize.apply(t, arguments);
      t.lastIdleCpu = 0;
      t.lastWorkingCpu = 0;
      t.infoElems = {};

      // Build the templates
      if (!template) {
        template = Template.fromDOM('#nm-template-core-AppViewer');
      }

      // Set default monitor options
      if (!t.monitor.get('probeClass')) {
        t.monitor.set({
          probeClass: 'Process',
        });
      }

      // Set up logging
      t.logCtxt = t.monitor.get('initParams');
      logger.info('init', t.logCtxt);
    },

    render: function() {
      var t = this;

      // Create the monitor in the loading state
      t.$el.html(template.get('text'));

      // Render the CPU gauges
      t.cpu1 = t.renderCpuGauge("CPU Activity");
      t.cpu2 = t.renderCpuGauge("1 Min. Load");
      t.cpu3 = t.renderCpuGauge("5 Min. Load");
      t.cpu4 = t.renderCpuGauge("15 Min Load");

      // Render the memory bars
      t.mem1 = t.renderMemBar();
      t.mem2 = t.renderMemBar();

      // Create the process info view, deferring render until we get real data
      var infoView = t.$('.nm-core-av-info').html('<div class="json"></div>')
        .find('.json');
      t.jsonView = new UI.JsonView({
        model: {},
        closedOnInit: true
      });
      infoView.append(t.jsonView.$el);

      // Listen for monitor events
      t.monitor.on('change', t._onProcessChange, t);
    },

    events: {
    },

    // Render the specified CPU gauge and return the DOM element
    renderCpuGauge: function(title) {
      var t = this,
          el = $('<div class="cpu">' +
                   '<div class="cpu-gauge"></div>' +
                   '<div class="cpu-level">&nbsp;</div>' +
                   '<div class="cpu-title">' + title + '</div>' +
                 '</div>')
               .appendTo(t.$('.nm-core-av-cpu'))
               .find('.cpu-gauge');

      // Render a highcharts gauge
      var opts = {
        chart: {
          type: 'gauge',
          animation: true,
          renderTo: el[0],
          margin: 0,
          plotBackgroundColor: 'transparent',
          plotBorderWidth: 0
        },
	pane: {
	  startAngle: -55,
	  endAngle: 55,
	  center: ['50%', '125%'],
	  size: '180%'
	},
        plotOptions: {
          gauge: {
            dial: {
	      radius: '85%',
              backgroundColor: 'rgba(200,183,155,1)'
            }
          }
        },
        yAxis: {
          labels: {distance: 100},
          min: 0,
          max: 100,
          tickInterval: 20,
          lineWidth: 0,
          minorTickLength: 5,
          minorTickColor: 'rgba(200,183,155,1)',
          tickWidth: 2,
          tickLength: 8,
          tickColor: 'rgba(200,183,155,1)'
        },
        series: [{id: "value", data: [0]}]
      };

      // Return the chart object
      return new Highcharts.Chart(opts);
    },


    // Render the memory bar chart
    renderMemBar: function(title) {
      var t = this,
          el = $('<div class="mem">' +
                   '<div class="mem-stat"></div>' +
                   '<div class="mem-bar"></div>' +
                 '</div>')
               .appendTo(t.$('.nm-core-av-mem'));

      var opts = {
        chart: {
          type: 'column',
          renderTo: el.find('.mem-bar')[0],
          margin: 0,
          x_plotBackgroundColor: 'transparent',
          x_plotBorderWidth: 0
        },
        legend: {enabled:false},
        title: {
          text: ''
        },
        xAxis: {
          categories: [''],
          lineWidth: 0,
        },
        yAxis: {
          min: 0,
          gridLineWidth: 0,
          title: {
            text: ''
          }
        },
        tooltip: {
          enabled: false
        },
        plotOptions: {
          column: {
            stacking: 'percent'
          }
        },
        series: [{
          name: '',
          data: [1]
        }, {
          name: '',
          data: [1]
        }, {
          name: '',
          data: [0]
        }]
      };

      // Create the chart and return the dom selector
      var chart = new Highcharts.Chart(opts);
      el.data('chart', chart);
      return el;
    },

    // Process a change in the (main) process monitor
    _onProcessChange: function(monitorEvent){
      var t = this,
          process = t.monitor.toProbeJSON(),
          animate = t.viewOptions.get('animate') ? true : false;

        // Re-compute the CPU gauges
        var loadNow = function(chart) {
          var pct = 0, i = 0, cpus = process.cpus, idleCpu = 0, workingCpu = 0;
          for (;i < cpus.length; i++) {
            var times = cpus[i].times;
            idleCpu += times.idle;
            workingCpu += times.sys + times.user;
          }

          // Update if the last values were known
          if (t.lastIdleCpu !== 0) {
            var workDiff = workingCpu - t.lastWorkingCpu,
                idleDiff = idleCpu - t.lastIdleCpu,
                pctWork = workDiff / (workDiff + idleDiff);
            showPct(chart, pctWork);
          }
          t.lastIdleCpu = idleCpu;
          t.lastWorkingCpu = workingCpu;
        }
        var loadPct = function(chart, index) {
          var numCpus = process.cpus.length,
              load = process.loadavg[index];
          showPct(chart, load / numCpus);
        }
        var showPct = function(chart, pct) {
          // Zero gauges if not connected
          if (!t.monitor.isConnected()) {
            pct = 0;
          }
          pct = Math.max(0, Math.min(100, Math.floor(pct * 100)));
          chart.series[0].data[0].update(pct, true, animate);
          $(chart.container).parent().parent().find('.cpu-level').text(pct + ' %');
        }

        // Delay loading load percentages until idle cpu is known
        if (t.lastIdleCpu !== 0) {
          loadPct(t.cpu2, 0);
          loadPct(t.cpu3, 1);
          loadPct(t.cpu4, 2);
        }
        loadNow(t.cpu1);

        // Update the memory bars
        t.mem1.find('.mem-stat').html('This Server<br><br>' +
          '<span class="stat1">&nbsp;</span> Process RSS:  ' + numeral(process.rss).format('0.0 b') + '<br>' +
          '<span class="stat2">&nbsp;</span> Total Heap:  ' + numeral(process.heapTotal).format('0.0 b') + '<br>' +
          '<span class="stat3">&nbsp;</span> Total Used:  ' + numeral(process.heapUsed).format('0.0 b') + '<br>' +
        '');
        t.mem1.data('chart').series[0].data[0].update(process.rss - process.heapTotal, false);
        t.mem1.data('chart').series[1].data[0].update(process.heapTotal - process.heapUsed, false);
        t.mem1.data('chart').series[2].data[0].update(process.heapUsed, true, animate);

        t.mem2.find('.mem-stat').html('System Memory<br><br>' +
          '<span class="stat1">&nbsp;</span> Total Memory:  ' + numeral(process.totalmem).format('0.0 b') + '<br>' +
          '<span class="stat2">&nbsp;</span> Memory Used:  ' + numeral(process.totalmem - process.freemem).format('0.0 b') + '<br>' +
          '<span class="stat3">&nbsp;</span> This Server:  ' + numeral(process.rss).format('0.0 b') + '<br>' +
        '');
        t.mem2.data('chart').series[0].data[0].update(process.freemem, false);
        t.mem2.data('chart').series[1].data[0].update(process.totalmem - process.freemem - process.rss, false);
        t.mem2.data('chart').series[2].data[0].update(process.rss, true, animate);

        // Update process information
        for (var attrName in INFO_MAP) {
          t.infoElems[attrName] = t.monitor.get(INFO_MAP[attrName]);
        }
        t.jsonView.setData(t.infoElems);

    }

  });

  // Custom settings form for the Text view
  AppViewer.SettingsView = Backbone.View.extend({

    render: function() {
      var t = this,
          server = t.$el.html('<div class="server"></div>');
      t.monitor = t.options.monitor;
      t.model = t.options.model;

      // Append a server picker
      t.serverPicker = new UI.MonitorPicker({
        el: server,
        model: t.monitor,
        hideProbe: true,
        hideParams: true
      });
      t.serverPicker.render();

      // Animate the charts?
      var elem =
        $('<div class="nm-core-av-anim"><span class="nm-core-av-anim-head" title="This takes more CPU on the browser">Smooth Animation:</span> <input type="checkbox" class="nm-core-av-anim"/></div>').appendTo(server);
      t.animate = t.$el.find('.nm-core-av-anim').attr('checked', t.model.get('animate') ? 'checked' : null);
    },

    events: {
      'change .nm-core-av-anim':  'onSelect'
    },

    onSelect: function(e) {
      var t = this,
          checked = t.animate.attr('checked') === 'checked';

      // Set the monitor fields
      t.model.set({
        animate: checked
      });
    }

  });

}(this));

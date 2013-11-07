// Clock.js (c) 2010-2013 Loren West and other contributors
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

  // Constants
  var RE_RENDER_AFTER_MS = 60000;

  /**
  * A clock view
  *
  * @class Clock
  * @extends Backbone.View
  * @constructor
  * @param options {Object} View initialization options (See others in Backbone.View)
  *     @param options.label='Chart' {String} The component label
  *     @param options.icon='icon-bar-chart' {String} The icon class name
  *     @param options.highcharts = {} {Object} Highcharts chart configuration object
  */
  var Clock = core.Clock = core.Chart.extend({

    // Define the view
    name: 'Clock',
    tags: ['Utility'],
    icon: 'image/Clock.png',
    description: 'A nice analog clock',
    defaultOptions: {
      title: 'Clock',
      highcharts: {
        chart: {
          type: 'gauge',
          margin: 0,
          plotBackgroundColor: 'transparent',
          plotBorderWidth: 0,
          plotShadow: false
        },
        plotOptions: {
          gauge: {
            dial: {
              backgroundColor: 'rgba(200,183,155,1)'
            },
            pivot: {
              backgroundColor: 'rgba(200,183,155,1)'
            }
          }
        },

        yAxis: {
          labels: {
            distance: -20
          },
          min: 0,
          max: 12,
          lineWidth: 0,
          showFirstLabel: false,
          minorTickInterval: 'auto',
          minorTickWidth: 1,
          minorTickLength: 5,
          minorTickPosition: 'inside',
          minorGridLineWidth: 0,
          minorTickColor: 'rgba(200,183,155,1)',
          tickInterval: 1,
          tickWidth: 2,
          tickPosition: 'inside',
          tickLength: 10,
          tickColor: 'rgba(200,183,155,1)',
          minPadding:0,
          maxPadding:0,
          title: {
            text: ''
          }
        },
        series: [{
          data: [{
            id: 'hour',
            y: 4,
            dial: {
              radius: '60%',
              baseWidth: 4,
              baseLength: '95%',
              rearLength: 0
            }
          }, {
            id: 'minute',
            y: 20,
            dial: {
              baseLength: '95%',
              rearLength: 0
            }
          }, {
            id: 'second',
            y: 0,
            dial: {
              radius: '100%',
              baseWidth: 1,
              rearLength: '20%'
            }
          }],
          animation: false,
          dataLabels: {
            enabled: false
          }
        }]
      }
    },

    initialize: function(options) {
      var t = this;
      options.component.setDefaultSize({
        width: 160,
        height: 160
      });
      core.Chart.prototype.initialize.apply(t, arguments);
    },

    render: function() {
      var t = this;
      core.Chart.prototype.render.apply(t, arguments);

      // Remember the last render time so we can refresh.
      // The clock needs complete refreshing or it'll peg the cpu
      t.lastRender = Date.now();

      // Add the toooltip formatter after the chart is known
      t.chart.options.tooltip.formatter = function(){return t.tooltipText;}

      // Kick off the timer
      t.onInterval();
    },

    onInterval: function() {
      var t = this,
          hour = t.chart.get('hour'),
          minute = t.chart.get('minute'),
          second = t.chart.get('second'),
          now = t.getNow(),
          // run animation unless we're wrapping around from 59 to 0
          // animation = now.seconds == 0 ? false : {easing: 'easeOutElastic'};
          animation = false;

      // Re-render now?
      if ((Date.now() - t.lastRender) > RE_RENDER_AFTER_MS) {
        t.$el.html('');
        t.render();
        return;
      }

      // Cache the tooltip text
      t.tooltipText =
        t.pad(Math.floor(now.hours), 2) + ':' +
        t.pad(Math.floor(now.minutes * 5), 2) + ':' +
        t.pad(now.seconds * 5, 2);

      hour.update(now.hours, true, animation);
      minute.update(now.minutes, true, animation);
      second.update(now.seconds, true, animation);

      // Set up for next iteration.  This is done via setTimeout vs. setInterval
      // because setInterval caused performance problems over time.
      setTimeout(function(){t.onInterval();}, 1000);
    },

    pad: function(number, length) {
      // Create an array of the remaining length +1 and join it with 0's
      return new Array((length || 2) + 1 - String(number).length).join(0) + number;
    },

    // Get the current time
    getNow: function() {
      var now = new Date();
      return {
        hours: now.getHours() + now.getMinutes() / 60,
        minutes: now.getMinutes() * 12 / 60 + now.getSeconds() * 12 / 3600,
        seconds: now.getSeconds() * 12 / 60
      };
    }

  });

  // No settings for the clock
  Clock.SettingsView = Backbone.View.extend({});

}(this));

// Extend jQuery with some easing (copied from jQuery UI)
$.extend($.easing, {
  easeOutElastic: function (x, t, b, c, d) {
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
  }
});

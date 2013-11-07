// Slider.js (c) 2010-2013 Loren West and other contributors
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
  * A generic slider
  *
  * The slider is initialized with a minimum, maximum, and current value, which
  * sets the initial position.
  *
  * As the slider is moved, the 'onSlide' event is emitted from the view.
  *
  *
  * @class Slider
  * @extends Backbone.View
  * @constructor
  * @param options {Object} View initialization options (See others in Backbone.View)
  *     @param [options.min=0] {Numeric} The minimum value
  *     @param [options.max=100] {Numeric} The maximum value
  *     @param [options.step=1] {Numeric} The slider step amount
  *     @param [options.initial=0] {Numeric} The initial slider value
  *     @param options.onSlide {String} Javascript code to run when the slider is positioned.
  */
  var Slider = core.Slider = Backbone.View.extend({

    // Define the view
    name: 'Slider',
    tags: ['Control'],
    icon: 'image/Slider.png',
    description: 'Displays a slider control, firing onSlide events as the control is moved',
    website: 'http://lorenwest.github.com/core-monitor',
    defaultOptions: {
      min: 0,
      max: 100,
      step: 1,
      initial: 0,
      onSlide: ''
    },

    initialize: function(options) {
      var t = this;
      t.viewOptions = t.options.viewOptions;
    },

    events: {
      'change .nm-core-slider': 'onSlide',
      'keyup .nm-core-slider': 'onChange',
      'mouseup .nm-core-slider': 'onChange',
      'keydown .nm-core-slider': 'onDown',
      'mousedown .nm-core-slider': 'onDown'
    },

    render: function() {
      var t = this,
          viewOpts = t.viewOptions.toJSON();
      t.slider = t.$el
        .html('<input class="nm-core-slider" type="range"/>')
      t.slider = t.$('.nm-core-slider');
      t.slider.attr({
        min: viewOpts.min,
        max: viewOpts.max,
        step: viewOpts.step,
        value: viewOpts.initial
      });
      t.slider.focus();
    },

    onSlide: function() {
      console.log("onSlide.  Value: " + this.slider.val());
    },
    onChange: function() {
      console.log("onChange.  Value: " + this.slider.val());
    },
    onDown: function() {
      console.log("onDown.  Value: " + this.slider.val());
    },
    onResize: function() {
      var t = this,
          pageView = t.options.pageView,
          component = t.options.component,
          monitor = component.monitor,
          getMonitor = function(id) {return pageView.getMonitor(id);},
          onSlide = t.viewOptions.get('onPress');
      if (onSlide) {
        try {
          eval(onSlide);
        } catch (e) {
          alert("OnSlide error: '" + e.message + "'");
        }
      }
    }

  });


  // Custom settings form for the Slider view
  Slider.SettingsView = Backbone.View.extend({

    initialize: function(options) {
      var t = this;
      $.styleSheet(Slider.css, 'nm-core-ss-css');
    },

    render: function() {
      var t = this;
      t.$el.html(Slider.template);
      new UI.IconChooser({el:t.$('select')});
      t.model.on('change:icon', t.changeIcon, t);
      t.changeIcon();
    },

    changeIcon: function() {
      var t = this;
      t.$('i').attr('class', t.model.get('icon'));
    },

    // Overridden to unbind form elements
    remove: function() {
      var t = this;
      t.model.off('change:icon', t.changeIcon, t);
      return Backbone.View.prototype.remove.apply(t, arguments);
    }

  });

  Slider.css = {
    '.nm-core-ss i'        : 'font-size: 18px; margin-left: 20px;'
  };

  Slider.template =
    '<div class="nm-core-ss">' +
      '<label>Slider Label</label>' +
      '<input data-view-option="label" type="text"/>' +
      '<label>Icon</label>' +
      '<select data-view-option="icon" data-placeholder="Choose an Icon...">' +
        '<option value="">(no icon)</option>' +
      '</select>' +
      '<i></i>' +
      '<label>On Slider Press</label>' +
      '<textarea data-view-option="onPress" class="monospace-font"></textarea>' +
    '</div>'
  ;

}(this));

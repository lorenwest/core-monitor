// MacroEditor.js (c) 2010-2013 Loren West and other contributors
// May be freely distributed under the MIT license.
// For further details and documentation:
// http://lorenwest.github.com/core-monitor
(function(root){

  // Module loading
  var Monitor = root.Monitor || require('monitor-dashboard'),
      UI = Monitor.UI,
      Template = UI.Template,
      core = UI.app.core = UI.app.core || {},
      Backbone = Monitor.Backbone,
      template,
      _ = Monitor._;

  /**
  * The REPL macro editor dialog view
  *
  * @class MacroEditor
  * @extends Backbone.View
  * @constructor
  * @param options {Object} View initialization options (See others in Backbone.View)
  * @param options.model {Macro} - A Macro object
  */
  var MacroEditor = core.MacroEditor = Backbone.View.extend({

    initialize: function(options) {
      var t = this;
      t.model = t.options.model;
      t.modelBinder = new Backbone.ModelBinder();
      if (!template) {
        template = Template.fromDOM('#nm-template-core-MacroEditor');
      }
    },

    events: {
      "click .btn-primary"       : "savePageChanges",
      "click .btn-cancel"        : "cancelChanges",
    },

    render: function() {
      var t = this;
      t.$el.append(template.get('text'));
      t.editor = t.$('#nm-core-me');
      t.editor.centerBox().css({top:40}).modal('show');
      t.editor.on('shown', function() {
        t.$('.nm-core-me-desc').focus();
      });
      t.editor.on('hidden', function() {
        if (typeof t.options.onClose === 'function') {
          t.options.onClose();
        }
      });
      t.modelBinder.bind(t.model, t.$el);
    },

    savePageChanges: function() {
      var t = this;
      if (typeof t.options.onSave === 'function') {
        t.options.onSave();
      }
    },

    cancelChanges: function() {
      var t = this;
      if (typeof t.options.onCancel === 'function') {
        t.options.onCancel();
      }
    }

  });


}(this));

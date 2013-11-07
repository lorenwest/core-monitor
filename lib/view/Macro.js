// Macro.js (c) 2010-2013 Loren West and other contributors
// May be freely distributed under the MIT license.
// For further details and documentation:
// http://lorenwest.github.com/core-monitor
(function(root){

  // Module loading
  var Monitor = root.Monitor || require('monitor-dashboard'),
      UI = Monitor.UI,
      core = UI.app.core = UI.app.core || {},
      Backbone = Monitor.Backbone, _ = Monitor._;

  /**
  * A REPL macro
  *
  * @class Macro
  * @extends Backbone.Model
  * @constructor
  * @param model - Initial data model.  Can be a JS object or another Model.
  *     @param model.id {String} The key to the macro
  *     @param [model.description] {String} Description of the macro
  *     @param [model.lines] {String} Macro command lines (separated by \n)
  */
  var Macro = core.Macro = Backbone.Model.extend({

    defaults: {
      id:'',
      description:'',
      lines:''
    },

    /**
    * Get the macro lines as an array of strings
    *
    * @method getLines
    * @returns [String] Macro lines
    */
    getLines: function() {
      var t = this;
      return t.get('lines').trim().split('\n');
    }

  });

  /**
  * Constructor for a list of Macro objects
  *
  *     var myList = new Macro.List(initialElements);
  *
  * @static
  * @method List
  * @param [items] {Array} Initial list items.  These can be raw JS objects or Macro data model objects.
  * @return {Backbone.Collection} Collection of Macro data model objects
  */
  Macro.List = Backbone.Collection.extend({model: Macro});

}(this));

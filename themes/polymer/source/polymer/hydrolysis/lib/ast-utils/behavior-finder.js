/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
// jshint node: true
'use strict';
var estraverse = require('estraverse');

var docs   = require('./docs');
var esutil = require('./esutil');
var jsdoc  = require('./jsdoc');
var analyzeProperties = require('./analyze-properties');
var astValue = require('./ast-value.js');

var numFeatures = 0;

module.exports = function behaviorFinder() {
  /** @type {!Array<BehaviorDescriptor>} The behaviors we've found. */
  var behaviors = [];

  var currentBehavior = null;

  /**
   * special-case properties
   */
  var propertyHandlers = {
    properties: function(node) {
      var props = analyzeProperties(node);

      for (var i=0; i < props.length; i++) {
        currentBehavior.properties.push(props[i]);
      }
    }
  };

  /**
   * merges behavior with preexisting behavior with the same name.
   * here to support multiple @polymerBehavior tags referring
   * to same behavior. See iron-multi-selectable for example.
   */
  function mergeBehavior(newBehavior) {
    var isBehaviorImpl = function(b) { // filter out BehaviorImpl
      return b.indexOf(newBehavior.is) === -1;
    };
    for (var i=0; i<behaviors.length; i++) {
      if (newBehavior.is !== behaviors[i].is)
        continue;
      // merge desc, longest desc wins
      if (newBehavior.desc) {
        if (behaviors[i].desc) {
          if (newBehavior.desc.length > behaviors[i].desc.length)
            behaviors[i].desc = newBehavior.desc;
        }
        else {
          behaviors[i].desc = newBehavior.desc;
        }
      }
      // merge demos
      behaviors[i].demos = (behaviors[i].demos || []).concat(newBehavior.demos || []);
      // merge events,
      behaviors[i].events = (behaviors[i].events || []).concat(newBehavior.events || []);
      // merge properties
      behaviors[i].properties = (behaviors[i].properties || []).concat(newBehavior.properties || []);
      // merge behaviors
      behaviors[i].behaviors =
        (behaviors[i].behaviors || []).concat(newBehavior.behaviors || [])
        .filter(isBehaviorImpl);
      return behaviors[i];
    }
    return newBehavior;
  }

  var visitors = {

    /**
     * Look for object declarations with @behavior in the docs.
     */
    enterVariableDeclaration: function(node, parent) {
      if (node.declarations.length !== 1) return;  // Ambiguous.
      this._initBehavior(node, function () {
        return esutil.objectKeyToString(node.declarations[0].id);
      });
    },

    /**
     * Look for object assignments with @polymerBehavior in the docs.
     */
    enterAssignmentExpression: function(node, parent) {
      this._initBehavior(parent, function () {
        return esutil.objectKeyToString(node.left);
      });
    },

    _parseChainedBehaviors: function(node) {
      // if current behavior is part of an array, it gets extended by other behaviors
      // inside the array. Ex:
      // Polymer.IronMultiSelectableBehavior = [ {....}, Polymer.IronSelectableBehavior]
      // We add these to behaviors array
      var expression;
      switch(node.type) {
        case 'ExpressionStatement':
          expression = node.expression.right;
        break;
        case 'VariableDeclaration':
          expression = node.declarations.length > 0 ? node.declarations[0].init : null;
        break;
      }
      var chained = [];
      if (expression && expression.type === 'ArrayExpression') {
        for (var i=0; i < expression.elements.length; i++) {
          if (expression.elements[i].type === 'MemberExpression')
            chained.push(astValue.expressionToValue(expression.elements[i]));
        }
        if (chained.length > 0)
          currentBehavior.behaviors = chained;
      }
    },

    _initBehavior: function(node, getName) {
      var comment = esutil.getAttachedComment(node);
      // Quickly filter down to potential candidates.
      if (!comment || comment.indexOf('@polymerBehavior') === -1) return;


      currentBehavior = {
        type: 'behavior',
        desc: comment,
        events: esutil.getEventComments(node).map( function(event) {
          return { desc: event};
        })
      };

      docs.annotateBehavior(currentBehavior);
      // Make sure that we actually parsed a behavior tag!
      if (!jsdoc.hasTag(currentBehavior.jsdoc, 'polymerBehavior')) {
        currentBehavior = null;
        return;
      }

      var name = jsdoc.getTag(currentBehavior.jsdoc, 'polymerBehavior', 'name');
      if (!name) {
        name = getName();
      }
      if (!name) {
        console.warn('Unable to determine name for @polymerBehavior:', comment);
      }
      currentBehavior.is = name;

      this._parseChainedBehaviors(node);

      currentBehavior = mergeBehavior(currentBehavior);
    },

    /**
     * We assume that the object expression after such an assignment is the
     * behavior's declaration. Seems to be a decent assumption for now.
     */
    enterObjectExpression: function(node, parent) {
      if (!currentBehavior || currentBehavior.properties) return;

      currentBehavior.properties = currentBehavior.properties || [];
      for (var i = 0; i < node.properties.length; i++) {
        var prop = node.properties[i];
        var name = esutil.objectKeyToString(prop.key);
        if (!name) {
          throw {
            message: 'Cant determine name for property key.',
            location: node.loc.start
          };
        }
        if (name in propertyHandlers) {
          propertyHandlers[name](prop.value);
        }
        else {
          currentBehavior.properties.push(esutil.toPropertyDescriptor(prop));
        }
      }
      behaviors.push(currentBehavior);
      currentBehavior = null;
    },

  };

  return {visitors: visitors, behaviors: behaviors};
};

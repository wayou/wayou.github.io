/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
'use strict';

// jshint node:true

var jsdoc = require('./jsdoc');

var dom5 = require('dom5');

/** Properties on element prototypes that are purely configuration. */
var ELEMENT_CONFIGURATION = [
  'attached',
  'attributeChanged',
  'configure',
  'constructor',
  'created',
  'detached',
  'enableCustomStyleProperties',
  'extends',
  'hostAttributes',
  'is',
  'listeners',
  'mixins',
  'observers',
  'properties',
  'ready',
  'registered'
];

/** Tags understood by the annotation process, to be removed during `clean`. */
var HANDLED_TAGS = [
  'param',
  'return',
  'type',
];

/**
 * Annotates Hydrolysis descriptors, processing any `desc` properties as JSDoc.
 *
 * You probably want to use a more specialized version of this, such as
 * `annotateElement`.
 *
 * Processed JSDoc values will be made available via the `jsdoc` property on a
 * descriptor node.
 *
 * @param {Object} descriptor The descriptor node to process.
 * @return {Object} The descriptor that was given.
 */
function annotate(descriptor) {
  if (!descriptor || descriptor.jsdoc) return descriptor;

  if (typeof descriptor.desc === 'string') {
    descriptor.jsdoc = jsdoc.parseJsdoc(descriptor.desc);
    // We want to present the normalized form of a descriptor.
    descriptor.jsdoc.orig = descriptor.desc;
    descriptor.desc       = descriptor.jsdoc.body;
  }

  return descriptor;
}

/**
 * Annotates @event, @hero, & @demo tags
 */
function annotateElementHeader(descriptor) {
  if (descriptor.events) {
    descriptor.events.forEach(function(event) {
      _annotateEvent(event);
    });
    descriptor.events.sort( function(a,b) {
      return a.name.localeCompare(b.name);
    });
  }
  descriptor.demos = [];
  if (descriptor.jsdoc && descriptor.jsdoc.tags) {
    descriptor.jsdoc.tags.forEach( function(tag) {
      switch(tag.tag) {
        case 'hero':
          descriptor.hero = tag.name || 'hero.png';
          break;
        case 'demo':
          descriptor.demos.push({
            desc: tag.body || 'demo',
            path: tag.name || 'demo/index.html'
          });
      }
    });
  }
}

/**
 * Annotates documentation found within a Hydrolysis element descriptor. Also
 * supports behaviors.
 *
 * If the element was processed via `hydrolize`, the element's documentation
 * will also be extracted via its <dom-module>.
 *
 * @param {Object} descriptor The element descriptor.
 * @return {Object} The descriptor that was given.
 */
function annotateElement(descriptor) {
  if (!descriptor.desc && descriptor.type === 'element') {
    descriptor.desc = _findElementDocs(descriptor.is,
                                       descriptor.domModule,
                                       descriptor.scriptElement);
  }
  annotate(descriptor);

  // The `<dom-module>` is too low level for most needs, and it is _not_
  // serializable. So we drop it now that we've extracted all the useful bits
  // from it.
  delete descriptor.domModule;

  // Descriptors that should have their `desc` properties parsed as JSDoc.
  descriptor.properties.forEach(function(property) {
    // Feature properties are special, configuration is really just a matter of
    // inheritance...
    annotateProperty(property, descriptor.abstract);
  });

  // It may seem like overkill to always sort, but we have an assumption that
  // these properties are typically being consumed by user-visible tooling.
  // As such, it's good to have consistent output/ordering to aid the user.
  descriptor.properties.sort(function(a, b) {
    // Private properties are always last.
    if (a.private && !b.private) {
      return 1;
    } else if (!a.private && b.private) {
      return -1;
    // Otherwise, we're just sorting alphabetically.
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  annotateElementHeader(descriptor);

  return descriptor;
}

/**
 * Annotates behavior descriptor.
 * @param {Object} descriptor behavior descriptor
 * @return {Object} descriptor passed in as param
 */
function annotateBehavior(descriptor) {
  annotate(descriptor);

  annotateElementHeader(descriptor);

  return descriptor;
}

/**
 * Annotates event documentation
 */
function _annotateEvent(descriptor) {
  annotate(descriptor);
  // process @event
  var eventTag = jsdoc.getTag(descriptor.jsdoc, 'event');
  descriptor.name = eventTag ? eventTag.name : "N/A";

  // process @params
  descriptor.params = (descriptor.jsdoc.tags || [])
    .filter( function(tag) {
      return tag.tag === 'param';
    })
    .map( function(tag) {
      return {
        type: tag.type || "N/A",
        desc: tag.body,
        name: tag.name || "N/A"
      };
    });
  // process @params
  return descriptor;
}

/**
 * Annotates documentation found about a Hydrolysis property descriptor.
 *
 * @param {Object} descriptor The property descriptor.
 * @param {boolean} ignoreConfiguration If true, `configuration` is not set.
 * @return {Object} The descriptior that was given.
 */
function annotateProperty(descriptor, ignoreConfiguration) {
  annotate(descriptor);
  if (descriptor.name[0] === '_' || jsdoc.hasTag(descriptor.jsdoc, 'private')) {
    descriptor.private = true;
  }

  if (!ignoreConfiguration && ELEMENT_CONFIGURATION.indexOf(descriptor.name) !== -1) {
    descriptor.private       = true;
    descriptor.configuration = true;
  }

  // @type JSDoc wins
  descriptor.type = jsdoc.getTag(descriptor.jsdoc, 'type', 'type') || descriptor.type;

  if (descriptor.type.match(/^function/i)) {
    _annotateFunctionProperty(descriptor);
  }

  // @default JSDoc wins
  var defaultTag = jsdoc.getTag(descriptor.jsdoc, 'default');
  if (defaultTag !== null) {
    descriptor.default = (defaultTag.name || '') + (defaultTag.body || '');
  }

  return descriptor;
}

/** @param {Object} descriptor */
function _annotateFunctionProperty(descriptor) {
  descriptor.function = true;

  var returnTag = jsdoc.getTag(descriptor.jsdoc, 'return');
  if (returnTag) {
    descriptor.return = {
      type: returnTag.type,
      desc: returnTag.body,
    };
  }

  var paramsByName = {};
  (descriptor.params || []).forEach(function(param) {
    paramsByName[param.name] = param;
  });
  (descriptor.jsdoc && descriptor.jsdoc.tags || []).forEach(function(tag) {
    if (tag.tag !== 'param') return;
    var param = paramsByName[tag.name];
    if (!param) {
      return;
    }

    param.type = tag.type || param.type;
    param.desc = tag.body;
  });
}

/**
 * Converts raw features into an abstract `Polymer.Base` element.
 *
 * Note that docs on this element _are not processed_. You must call
 * `annotateElement` on it yourself if you wish that.
 *
 * @param {Array<FeatureDescriptor>} features
 * @return {ElementDescriptor}
 */
function featureElement(features) {
  var properties = features.reduce(function(result, feature) {
    return result.concat(feature.properties);
  }, []);

  return {
    type:       'element',
    is:         'Polymer.Base',
    abstract:   true,
    properties: properties,
    desc: '`Polymer.Base` acts as a base prototype for all Polymer ' +
          'elements. It is composed via various calls to ' +
          '`Polymer.Base._addFeature()`.\n' +
          '\n' +
          'The properties reflected here are the combined view of all ' +
          'features found in this library. There may be more properties ' +
          'added via other libraries, as well.',
  };
}

/**
 * Cleans redundant properties from a descriptor, assuming that you have already
 * called `annotate`.
 *
 * @param {Object} descriptor
 */
function clean(descriptor) {
  if (!descriptor.jsdoc) return;
  // The doctext was written to `descriptor.desc`
  delete descriptor.jsdoc.body;
  delete descriptor.jsdoc.orig;

  var cleanTags = [];
  (descriptor.jsdoc.tags || []).forEach(function(tag) {
    // Drop any tags we've consumed.
    if (HANDLED_TAGS.indexOf(tag.tag) !== -1) return;
    cleanTags.push(tag);
  });

  if (cleanTags.length === 0) {
    // No tags? no docs left!
    delete descriptor.jsdoc;
  } else {
    descriptor.jsdoc.tags = cleanTags;
  }
}

/**
 * Cleans redundant properties from an element, assuming that you have already
 * called `annotateElement`.
 *
 * @param {ElementDescriptor|BehaviorDescriptor} element
 */
function cleanElement(element) {
  clean(element);
  element.properties.forEach(cleanProperty);
}

/**
 * Cleans redundant properties from a property, assuming that you have already
 * called `annotateProperty`.
 *
 * @param {PropertyDescriptor} property
 */
function cleanProperty(property) {
  clean(property);
}

/**
 * @param {string} elementId
 * @param {DocumentAST} domModule
 * @param {DocumentAST} scriptElement The script that the element was defined in.
 */
function _findElementDocs(elementId, domModule, scriptElement) {
  // Note that we concatenate docs from all sources if we find them.
  // element can be defined in:
  // html comment right before dom-module
  // html commnet right before script defining the module, if dom-module is empty

  var found = [];

  // Do we have a HTML comment on the `<dom-module>` or `<script>`?
  //
  // Confusingly, with our current style, the comment will be attached to
  // `<head>`, rather than being a sibling to the `<dom-module>`
  var searchRoot = domModule || scriptElement;
  var parents = dom5.nodeWalkAllPrior(searchRoot, dom5.isCommentNode);
  var comment = parents.length > 0 ? parents[0] : null;
  if (comment && comment.data) {
    found.push(comment.data);
  }
  if (found.length === 0) return null;
  return found
    .filter(function(comment) {
      // skip @license comments
      if (comment && comment.indexOf('@license' === -1)) {
        return true;
      }
      else {
        return false;
      }
    })
    .map(jsdoc.unindent).join('\n');
}

function _findLastChildNamed(name, parent) {
  var children = parent.childNodes;
  for (var i = children.length - 1, child; i >= 0; i--) {
    child = children[i];
    if (child.nodeName === name) return child;
  }
  return null;
}

// TODO(nevir): parse5-utils!
function _getNodeAttribute(node, name) {
  for (var i = 0, attr; i < node.attrs.length; i++) {
    attr = node.attrs[i];
    if (attr.name === name) {
      return attr.value;
    }
  }
}

module.exports = {
  annotate:        annotate,
  annotateElement: annotateElement,
  annotateBehavior: annotateBehavior,
  clean:           clean,
  cleanElement:    cleanElement,
  featureElement:  featureElement,
};

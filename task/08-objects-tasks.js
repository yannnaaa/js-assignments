'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/

/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.__proto__.getArea = function () { 
    return this.width * this.height; 
  };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
  return JSON.parse(json, (k, v) => {
    if (k === "") {
      let arr = [];
            
        for (var property in v) {
          arr.push(v[property]);
        }

        return new proto.constructor(...arr);
    } else return v;
  });
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */


const cssSelectorBuilder = {
  str: '', 
  
  element: function(value) {      
    let MySuperBaseElementSelector = function (value) {    
      MySuperBaseElementSelector.prototype = cssSelectorBuilder;    
      cssSelectorBuilder.str += value;           
      this.val= cssSelectorBuilder.str;                 
      
      this.element = function () {
        throw 'Element, id and pseudo-element should not occur more then one time inside the selector';
      };
      
      this.id = this.constructor.prototype.id;
      this.class = this.constructor.prototype.class;
      this.attr = this.constructor.prototype.attr;
      this.pseudoClass = this.constructor.prototype.pseudoClass;
      this.pseudoElement = this.constructor.prototype.pseudoElement;            
      this.stringify = this.constructor.prototype.stringify;
    }
    
    return new MySuperBaseElementSelector(value);        
  },
  
  id: function(value) {
    let MySuperBaseIdSelector = function (value) {
      MySuperBaseIdSelector.prototype = cssSelectorBuilder;  
      cssSelectorBuilder.str += '#' + value;
      this.val = cssSelectorBuilder.str;
      
      this.element = function () {
        throw 'Selector parts should be arranged in the following order: element, id, class, '
              + 'attribute, pseudo-class, pseudo-element';
      };
      
      this.id = function () {
        throw 'Element, id and pseudo-element should not occur more then one time inside the selector';
      };
      
      this.class = this.constructor.prototype.class;
      this.attr = this.constructor.prototype.attr;
      this.pseudoClass = this.constructor.prototype.pseudoClass;
      this.pseudoElement = this.constructor.prototype.pseudoElement;
      this.stringify = this.constructor.prototype.stringify;
    }
    
    return new MySuperBaseIdSelector(value);
  },
   
  class: function(value) {
    let MySuperBaseClassSelector = function (value) {
      MySuperBaseClassSelector.prototype = cssSelectorBuilder;
      cssSelectorBuilder.str += '.' + value;
      this.val = cssSelectorBuilder.str;
      
      this.element = this.id = function () {
        throw 'Selector parts should be arranged in the following order: element, id, class, '
          + 'attribute, pseudo-class, pseudo-element';
      };
      
      this.class = this.constructor.prototype.class;
      this.attr = this.constructor.prototype.attr;
      this.pseudoClass = this.constructor.prototype.pseudoClass;
      this.pseudoElement = this.constructor.prototype.pseudoElement;
      this.stringify = this.constructor.prototype.stringify;
    }
    
    return new MySuperBaseClassSelector(value);
  },

  attr: function(value) {
    let MySuperBaseAttrSelector = function (value) {
      MySuperBaseAttrSelector.prototype = cssSelectorBuilder;
      cssSelectorBuilder.str += '[' + value + ']';
      this.val = cssSelectorBuilder.str;
      
      this.element = this.id = this.class = function () {
        throw 'Selector parts should be arranged in the following order: element, id, class, '
          + 'attribute, pseudo-class, pseudo-element';
      };
      
      this.attr = this.constructor.prototype.attr;
      this.pseudoClass = this.constructor.prototype.pseudoClass;
      this.pseudoElement = this.constructor.prototype.pseudoElement;
      this.stringify = this.constructor.prototype.stringify;
    }
    
    return new MySuperBaseAttrSelector(value);
  },

  pseudoClass: function(value) {
    let MySuperBasePseudoClassSelector = function (value) {
      MySuperBasePseudoClassSelector.prototype = cssSelectorBuilder;
      cssSelectorBuilder.str += ':' + value;
      this.val = cssSelectorBuilder.str;
      
      this.element = this.id = this.class = this.attr = function () {
        throw 'Selector parts should be arranged in the following order: element, id, class, '
          + 'attribute, pseudo-class, pseudo-element';
      };
      
      this.pseudoClass = this.constructor.prototype.pseudoClass;
      this.pseudoElement = this.constructor.prototype.pseudoElement;
      this.stringify = this.constructor.prototype.stringify;
    }
    
    return new MySuperBasePseudoClassSelector(value);
  },

  pseudoElement: function(value) {
    let MySuperBasePseudoElementSelector = function (value) {
      MySuperBasePseudoElementSelector.prototype = cssSelectorBuilder;
      cssSelectorBuilder.str += '::' + value;
      this.val = cssSelectorBuilder.str;
      
      this.element = this.id = this.class = this.attr = this.pseudoClass = function () {
        throw 'Selector parts should be arranged in the following order: element, id, class, '
          + 'attribute, pseudo-class, pseudo-element';
      };
      
      this.pseudoElement = function () {
        throw 'Element, id and pseudo-element should not occur more then one time inside the selector';
      };
      
      this.stringify = this.constructor.prototype.stringify;       
    }
    
    return new MySuperBasePseudoElementSelector(value);
  },

  combine: function(selector1, combinator, selector2) {
    let MySuperBaseCombineSelector = function (selector1, combinator, selector2) {
      let selector1Val = selector1.val;
      let selector2Val = selector2.val.slice((selector1.val).length);
    
      this.val = selector1Val + ' ' + combinator + ' ' + selector2Val;              
      this.stringify = function () { 
        cssSelectorBuilder.str = '';
      
        return  this.val;
      };  
    }
  
    return new MySuperBaseCombineSelector(selector1, combinator, selector2);        
  }, 
    
  stringify: function () { 
    this.val = cssSelectorBuilder.str;
    cssSelectorBuilder.str = '';       
  
    return  this.val;                
  } 
};

module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};
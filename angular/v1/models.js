/* global angular */

'use strict';

angular.module('dndTreeTest')
  /**
   * Models Manager
   * @return {ModelsManager}
   */
  .service('ModelsManager', function (Basket, Box, Fruit) {
    return {
      baskets: {},
      boxes: {},
      fruits: {},
      /**
       * Add basket
       * @param {string} id   [description]
       * @param {Object} args [description]
       */
      addBasket: function (id, args) {
        var self = this;
        var model;
        if (id instanceof Basket) {
          model = id;
        } else {
          model = new Basket(id, args);
        }
        this.baskets[model.id] = model;
        return model;
      },
      /**
       * Add box
       * @param {string} id   [description]
       * @param {Object} args [description]
       */
      addBox: function (id, args) {
        var model;
        if (id instanceof Box) {
          model = id;
        } else {
          model = new Box(id, args);
        }
        this.boxes[model.id] = model;
        return model;
      },
      /**
       * Add fruit
       * @param {string} id   [description]
       * @param {Object} args [description]
       */
      addFruit: function (id, args) {
        var model;
        if (id instanceof Fruit) {
          model = id;
        } else {
          model = new Fruit(id, args);
        }
        this.fruits[model.id] = model;
        return model;
      }
    };
  })
  /**
   * Basket
   *
   * @class
   */
  .factory('Basket', function (Utils) {

    /**
     * @constructor
     * @param {[type]} data [description]
     */
    function Basket(id, args) {
      this['id'] = id || Utils.getRandomId(7);
      this.boxes = [];
      this.fruits = [];
      if (args) {
        this.setArgs(args);
      }
      this.subject = 'basket';
    }

    Basket.prototype = {
      setArgs: function (args) {
        angular.extend(this, args);
      },
      addBox: function (box) {
        if (this.boxes.indexOf(box.id) === -1) {
          this.boxes.push(box);
        } else {
          console.log('box is already in basket', this.id, box);
        }
      },
      addFruit: function (fruit) {
        if (this.fruits.indexOf(fruit.id) === -1) {
          this.fruits.push(fruit);
        } else {
          console.log('fruit is already in box', this.id, fruit);
        }
      },
    };
    return Basket;
  })
  /**
   * Box
   *
   * @class
   */
  .factory('Box', function (Utils) {

    /**
     * @constructor
     * @param {[type]} data [description]
     */
    function Box(id, args) {
      this['id'] = id || Utils.getRandomId(7);
      this['basket_id'] = '';
      this.fruits = [];
      this.boxes = [];
      if (args) {
        this.setArgs(args);
      }
      this.subject = 'box';
    }

    Box.prototype = {
      setArgs: function (args) {
        angular.extend(this, args);
      },
      addFruit: function (fruit) {
        if (this.fruits.indexOf(fruit.id) === -1) {
          this.fruits.push(fruit);
        } else {
          console.log('fruit is already in box', this.id, fruit);
        }
      },
      addBox: function (box) {
        if (this.boxes.indexOf(box.id) === -1) {
          this.boxes.push(box);
        } else {
          console.log('box is already in box', this.id, box);
        }
      },
    };
    return Box;
  })
  /**
   * Fruit
   *
   * @class
   */
  .factory('Fruit', function (Utils) {

    /**
     * @constructor
     * @param {[type]} data [description]
     */
    function Fruit(id, args) {
      this['id'] = id || Utils.getRandomId(7);
      this.subject = 'fruit';
    }

    Fruit.prototype = {
      setArgs: function (args) {
        angular.extend(this, args);
      }
    };
    return Fruit;
  });

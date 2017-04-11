'use strict';

angular.module('dndTreeTest')
  .service('Utils', function () {
    return {
      /**
       * Get random id
       *
       * @link http://stackoverflow.com/a/1349426/1938970
       * @param  {int} length The length of the id to create.
       * @return {String}     The generated random id.
       */
      getRandomId: function (length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
        for ( var i=0; i < length; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
      },
      /**
       * Find object by id in given array of objects, (each array
       * element object must have an id property).
       *
       * @param  {Array}  array                 The array containing the object.
       * @param  {String} id                    The id of the object to find.
       * @return {Object.<Object, int>|boolean} An object containg the found object and
       *                                        its position in the given array, or false
       *                                        if the object is not in the array.
       */
      findById: function (array, id) {
        var i = 0;
        while (i < array.length) {
          if (array[i].id === id) {
            return {
              obj: array[i],
              pos: i
            };
          }
          i++;
        }
        // throw new Error('Object with id ' + id + ' not found in array');
        return false;
      },
      /**
       * Remove object (by given id) from array.
       *
       * @param  {Array}  array    The array containing the object to move.
       * @param  {String} objectId The id of the object to move.
       * @return {Array}           The cleaned array.
       */
      removeByID: function (array, objectId) {
        var result = this.findById(array, objectId);
        if (!result) {
          return;
        }
        var index = result.pos;
        array.splice(index, 1);
        return array;
      }
    };
  });
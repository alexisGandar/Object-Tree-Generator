/* global angular */

'use strict';

angular.module('dndTreeTest', ['ui.bootstrap', 'dndLists'])
  /**
   * Helper Drag and drop (`dnd` related service)
   *
   */
  .service('HelperDnd', function (Utils) {

    var isDraggingFrom = 0;
    var draggingOriginList = [];

    return {
      dragstart: function (model, list, index) {
        console.log('drag', model.id, index);
        draggingOriginList = list;
        isDraggingFrom = index;
      },
      moved: function (model, list, index) {
        console.log('moved', model.id, index);
        list.splice(index, 1);
        return model;
      },
      /**
       * Drop (`dnd` related method)
       *
       * @param  {[type]} event [description]
       * @param  {[type]} index [description]
       * @param  {[type]} model [description]
       * @param  {[type]} list  [description]
       * @return {[type]}       [description]
       */
      drop: function (event, index, model, list) {
        // @see https://github.com/marceljuenemann/angular-drag-and-drop-lists/issues/54
        if (index < 0) {
          return;
        }
        var isDraggingTo = index;
        var result = Utils.findById(list, model.id);

        // if we are dropping the model in the same list, just reordering it
        if (result) {
          // first remove the model
          Utils.removeByID(list, model.id);

          // if it has been moved down from the first position fix the dnd bug
          // @see https://github.com/marceljuenemann/angular-drag-and-drop-lists/issues/54
          if (isDraggingTo > isDraggingFrom && isDraggingFrom === 0) {
            isDraggingTo--;
          }

          // insert the model in the new position
          list.splice(isDraggingTo, 0, model);
          console.log('dropped down', model.id, isDraggingTo);

        // if the list array is still empty or the model is coming from another list
        } else {
          // first remove the model
          if (angular.isArray(draggingOriginList)) {
            Utils.removeByID(draggingOriginList, model.id);
          }
          // if the destination list is not empty insert the model at the right position
          if (list.length) {
            list.splice(isDraggingTo, 0, model);
          // if the destination list is empty just push it
          } else {
            list.push(model);
          }
        }
        // console.log('drop', index, model, list);
        // return model;
      },
      dragover: function(event, index) {
        return index > 0;
      }
    };
  })
  .controller('TreeCtrl', function ($scope, ModelsManager, Utils, HelperDnd) {

    $scope.tree = [];

    /**
     * Add basket on root level of the tree
     *
     * @return {void}
     */
    $scope.addBasket = function () {
      var basket = ModelsManager.addBasket();
      $scope.tree.push(basket);
    };

    /**
     * Add box on root level of the tree
     *
     * @return {void}
     */
    $scope.addBox = function () {
      var box = ModelsManager.addBox();
      $scope.tree.push(box);
    };

    /**
     * Helper drag and drop
     * just expose all the service method on the scope.
     *
     * @type {Service}
     */
    $scope.helperDnd = HelperDnd;

    /**
     * Remove customize component
     *
     * @param  {Object} scope The ui-tree scope.
     * @param  {Object} model The customize component model to delete.
     * @return {void}
     */
    $scope.removeMe = function (scope, model, list) {
      Utils.removeByID(list, model.id);
    };

    /**
     * Collapse all models in the tree.
     *
     * @return {void}
     */
    $scope.collapseAll = function () {
      $scope.$broadcast('collapseAll');
    };

    /**
     * Expand all customize components in the tree, using the ui-tree API.
     *
     * @return {void}
     */
    $scope.expandAll = function () {
      $scope.$broadcast('expandAll');
    };

    /**
     * Move up or down a specific customize component
     *
     * @param  {Object} model  The model to move.
     * @param  {array}  list   Array in which the model is contained.
     * @param  {string} upOrDown Either `'up'` or `'down'`.
     * @return {void}
     */
    $scope.move = function (model, list, upOrDown) {
      Utils.moveByID(upOrDown, list, model.id);
    };

    /**
     * Add child to the given model
     *
     * @param  {Object} model
     * @return {void}
     */
    $scope.newChild = function (model, s) {
      var newModel;
      if (s != 'box') {
        newModel = ModelsManager.addBox(null, { 'basket_id': model.id });
        model.boxes.push(newModel);
      } else if (s != 'fruit') {
        newModel = ModelsManager.addFruit();
        //model.__proto__.addFruit(newModel);
        model.fruits.push(newModel);
      }
      // this.expand(); // ui-tree method
    };
  });

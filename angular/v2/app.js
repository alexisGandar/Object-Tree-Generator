var app = angular.module('plunker', ['angularBootstrapNavTree']);

app.controller('MainCtrl', function($scope) {
  $scope.name = 'World';

  var treedata_geography = [{
    label: 'North America',
    children: [{
      label: 'Canada',
      children: ['Toronto', 'Vancouver']
    }, {
      label: 'USA',
      children: ['New York', 'Los Angeles']
    }, {
      label: 'Mexico',
      children: ['Mexico City', 'Guadalajara']
    }]
  }, {
    label: 'South America',
    children: [{
      label: 'Venezuela',
      children: ['Caracas', 'Maracaibo']
    }, {
      label: 'Brazil',
      children: ['Sao Paulo', 'Rio de Janeiro']
    }, {
      label: 'Argentina',
      children: ['Buenos Aires', 'Cordoba']
    }]
  }];
  $scope.my_data = treedata_geography;

});
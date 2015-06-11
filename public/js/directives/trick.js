'use strict';

myApp.directive('trickItem', function(){

  return {
    restrict: 'EA',
    require: ['^trickobject'],
    scope: {
      trickobject: '='      
    },
    templateUrl: 'public/directives/trick.html'
  }
});

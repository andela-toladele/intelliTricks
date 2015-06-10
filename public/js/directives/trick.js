'use strict';

app.directive('trickItem', function(){

  return {
    restrict: 'EA',
    require: ['^trickobject'],
    scope: {
      dataobject: '=',
      
    },
    templateUrl: 'directives/trick.html'
  }
});

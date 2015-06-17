var myApp = angular.module('myApp', ['angularUtils.directives.dirPagination', 'ui.ace','ui.router','angularMoment','hljs'])
.config(function (hljsServiceProvider) {
  hljsServiceProvider.setOptions({
    // replace tab with 4 spaces
    tabReplace: '    '
  });
})
.run(function($rootScope) {
    $rootScope.loggedIn = false;
    $rootScope.userType = "";
    $rootScope.username = "";
    $rootScope.userId = "";
});
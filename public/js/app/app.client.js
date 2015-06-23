var myApp = angular.module('myApp', ['angularUtils.directives.dirPagination', 'ui.ace','ui.router','angularMoment','hljs','angularUtils.directives.dirDisqus','wu.masonry'])
.config(function (hljsServiceProvider) {
  hljsServiceProvider.setOptions({
    // replace tab with 4 spaces
    tabReplace: '    '
  });
})
.run(function($rootScope, $location, $window) {
    $rootScope.loggedIn = false;
    $rootScope.userType = "";
    $rootScope.username = "";
    $rootScope.userId = "";

    $rootScope.$on('$stateChangeSuccess', function() {
      $window.ga('send', 'pageview', { page: $location.url() });
    });
});
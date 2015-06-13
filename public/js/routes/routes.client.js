myApp.config(function($stateProvider, $urlRouterProvider){
  
  $urlRouterProvider.otherwise("/home");
  
  $stateProvider.
    state('home',{
      url: '/home',
      templateUrl: '/partials/tricks.html',
      controller: 'homeCntrl'
    }).
    state('categories',{
      url: '/categories',
      templateUrl: '/partials/categories.html',
      controller: 'categoriesCntrl'     
    }).
    state('newtrick',{
      url: '/createTrick',
      templateUrl: '/partials/createtrick.html',
      controller: 'newTrickCntrl'
    }).
    state('login',{
      url: '/login',
      templateUrl: '/partials/login.html',
      controller: 'loginCntrl'   
    }).
    state('register',{
      url: '/register',
      templateUrl: '/partials/signup.html',
      controller: 'registerCntrl'
    }).
    state('loadtricks',{
      url: '/viewtricks:by',
      templateUrl: '/partials/tricks.html',
      controller: 'tricksBrowserCntrl'     
    }).
    state('tricks',{
      url: '/tricks:id',
      templateUrl: '/partials/viewtrick.html',
      controller: 'viewTrickCntrl'
    }).
    state('category',{
      url: '/category:id',
      templateUrl: '/partials/tricks.html',
      controller: 'tricksByCategoryCntrl'
    });
   
});
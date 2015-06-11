myApp.config(function($stateProvider, $urlRouterProvider){
  
  $urlRouterProvider.otherwise("/home");
  
  $stateProvider.
    state('home',{
      url: '/home',
      templateUrl: 'public/partials/home.html',
      controller: 'homeCntrl'
    }).
    state('categories',{
      url: '/categories',
      templateUrl: 'public/partials/categories.html',
      controller: 'categoriesCntrl'     
    }).
    state('newtrick',{
      url: '/createTrick',
      templateUrl: 'public/partials/createtrick.html',
      controller: 'newTrickCntrl'
    }).
    state('login',{
      url: '/login',
      templateUrl: 'public/partials/login.html',
      controller: 'loginCntrl'   
    }).
    state('register',{
      url: '/register',
      templateUrl: 'public/partials/signup.html',
      controller: 'registerCntrl'
    }).
    state('loadtricks',{
      url: '/viewtricks:by',
      templateUrl: 'public/partials/tricks.html',
      controller: 'TricksBrowserCntrl'     
    }).
    state('tricks',{
      url: '/tricks:id',
      templateUrl: 'public/partials/viewtrick.html',
      controller: 'viewTrickCntrl'
    }).
    state('category',{
      url: '/category:id',
      templateUrl: 'public/partials/home.html',
      controller: 'tricksByCategoryCntrl'
    });
   
});
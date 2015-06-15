myApp.config(function($stateProvider, $urlRouterProvider){
  
  $urlRouterProvider.otherwise("/home");
  
  $stateProvider.
    state('home',{
      url: '/home',
      templateUrl: '/partials/tricks.html'
    }).
    state('categories',{
      url: '/categories',
      templateUrl: '/partials/categories.html'  
    }).
    state('newtrick',{
      url: '/createTrick',
      templateUrl: '/partials/createtrick.html',
      controller: 'newTrickCntrl'
    }).
    state('login',{
      url: '/login',
      templateUrl: '/partials/login.html'      
    }).
    state('register',{
      url: '/register',
      templateUrl: '/partials/signup.html',
      controller: 'registerCntrl'
    }).
    state('viewtricks',{
      url: '/viewtricks?by',
      templateUrl: '/partials/tricks.html'
    }).
    state('tricks',{
      url: '/tricks?id',
      templateUrl: '/partials/viewtrick.html'
    }).
    state('category',{
      url: '/category?id&name',
      templateUrl: '/partials/tricks.html'
    });
   
});
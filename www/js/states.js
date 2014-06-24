angular.module('states',[
  'states.home',  
  'states.one',
])
.config(function ($urlRouterProvider) {
   $urlRouterProvider.otherwise('/home');
});

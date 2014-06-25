angular.module('states',[
  'states.home',
  'states.search',
  'states.plan',
])
.config(function ($urlRouterProvider) {
   $urlRouterProvider.otherwise('/home');
});

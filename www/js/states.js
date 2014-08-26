angular.module('states',[
  'states.home',
  'states.search',
  'states.plan',
  'states.fill',
])
.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
});

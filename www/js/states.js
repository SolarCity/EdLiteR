angular.module('states',[
  'states.home',
  // 'states.search',
  // 'states.plan',
])
.config(function ($stateProvider, $urlRouterProvider) {
  // $stateProvider.state("home", {
  //   url: "/home",
  //   controller: "HomeCtrl",
  //   templateUrl: "templates/states/home/home.html",
  // });
  $urlRouterProvider.otherwise('/home');
});

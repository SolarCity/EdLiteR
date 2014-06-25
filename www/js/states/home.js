angular.module('states.home',[]).config( function ($stateProvider) {
  $stateProvider.state("home", {
    url: "/home",
    controller: "HomeCtrl",
    templateUrl: "../templates/templates/home.html",
  })
});

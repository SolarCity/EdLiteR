angular.module('states.home',[]).config( function ($stateProvider) {
  $stateProvider.state("home", {
    url: "/home",
    controller: "ExampleCtrl",
    templateUrl: "../templates/home.html",
    
  })
});

angular.module('states.search',[]).config( function ($stateProvider) {
  $stateProvider.state("search", {
    url: "/search",
    controller: "SearchCtrl",
    templateUrl: "../templates/states/search.html",
  })
});

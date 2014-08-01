angular.module('states.search',[]).config( function ($stateProvider) {
  $stateProvider.state("search", {
    url: "/search",
    controller: "SearchCtrl",
    controllerAs: "search",
    templateUrl: "templates/states/search/search.html",
  });
});

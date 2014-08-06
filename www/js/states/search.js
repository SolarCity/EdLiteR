angular.module('states.search',[]).config( function searchState($stateProvider) {
  $stateProvider.state("search", {
    url: "/search",
    template: [
    		"<ion-nav-view >",
					"<ion-view>",
					"</ion-view>",
				"</ion-nav-view>",
    ].join(''),
    controller: "SearchCtrl",
    controllerAs: "search",
    abstract: true
  })
  .state("search.find", {
    url: "/find",
    templateUrl: "templates/states/search/search.find.html",
  })
  .state("search.grab", {
    url: "/grab",
    templateUrl: "templates/states/search/search.grab.html",
  });
});

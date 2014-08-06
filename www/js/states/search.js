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
    // resolve: {
    // 	gmap: "MapService.getMap()"
    // },
    // controller: function searchFindCtrl () {
      // gmap.controls[google.maps.ControlPosition.TOP_LEFT].pop();
    // },
    templateUrl: "templates/states/search/search.grab.html",
  });
});

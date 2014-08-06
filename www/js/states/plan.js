angular.module('states.plan',[]).config( function ($stateProvider) {
  $stateProvider.state("plan", {
    url:         "/plan",
    // controller:  "PlanCtrl",
    templateUrl: "templates/states/plan/plan.html",

    abstract:    true,
  })
  .state("plan.drawing", {
    url:         "/drawing",
    controller:  "PlanDrawingCtrl",
    controllerAs: "drawCtrl",
    templateUrl: "templates/states/plan/plan.drawing.html",
    resolve: {
      staticMap: function(MapService) {
        MapService.getStatic().then(function(data) {
          return data
        });
      },
    },    

  });
});

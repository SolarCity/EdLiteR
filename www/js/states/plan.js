angular.module('states.plan',[]).config( function ($stateProvider) {
  $stateProvider.state("plan", {
    url:         "/plan",
    // controller:  "PlanCtrl",
    templateUrl: "templates/states/plan/plan.html",
    abstract:    true
  })
  .state("plan.drawing", {
    url:         "/drawing",
    // controller:  "PlanDrawingCtrl",
    templateUrl: "templates/states/plan/plan.drawing.html"
  });
});

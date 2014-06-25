angular.module('states.plan',[]).config( function ($stateProvider) {
  $stateProvider.state("plan", {
    url: "/plan",
    controller: "PlanCtrl",
    templateUrl: "../templates/states/plan.html",
  })
});

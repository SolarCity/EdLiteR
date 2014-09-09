angular.module('states.plan',[]).config( function StatesPlan($stateProvider) {
  $stateProvider.state("plan", {
    url:         "/plan",
    controller:  "PlanCtrl as plan",
    templateUrl: "templates/states/plan/plan.html",
    abstract:    true,
  })
  .state("plan.type", {
    url:         "",
    // data: { //TODO: this should be removed
    //   featureType: "mount"
    // },
    resolve: {
      featureArray: function resolveMountFeature($stateParams, OlService) {
        return OlService.getRecent('mount');
      },
    },
    views: {
      'planContent' :{
        templateUrl: 'templates/states/plan/planContent.html',
        controller:  "FeatureCtrl as feature",
      },
      'detailMenu' :{
        templateUrl: 'templates/states/plan/detailMenu.html', 
        controller: "DetailCtrl as detail",
      }
    },
  }).state("plan.fill", {
    url:         "/fill",
    views: {
      'planContent' :{
        templateUrl: 'templates/states/fill/fillContent.html',
        controller:  "FillCtrl as fill",
      },
      'detailMenu' :{
        templateUrl: 'templates/states/fill/detailMenu.html', 
        controller: "",
      }
    },
  })
;});

angular.module('states.plan',[]).config( function StatesPlan($stateProvider) {
  $stateProvider.state("plan", {
    url:         "/plan",
    controller:  "PlanCtrl as plan",
    resolve: {
      // staticMap: function(MapService) {
      //   MapService.getStatic().then(function(data) {
      //     return data;
      //   });
      // },
    },
    templateUrl: "templates/states/plan/plan.html",
    abstract:    true,
  })
  .state("plan.type", {
    url:         "",
    data: { //TODO: this should be removed
      featureType: "mount"
    },
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
  })
  .state("plan.type.fill", {
    url:         "/fill",
    controller:  "FillCtrl as fill",
    resolve: {
      FillService: function(PanelFillService) {
        return PanelFillService.sample;
      },
    },
    // templateUrl: "templates/states/fill/fill.html",
    template: "",
  })
;});

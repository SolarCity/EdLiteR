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
  .state("plan.mount", {
    url:         "/mount/:id",
    data: {
      targetLayer: "mount"
    },
    resolve: {
      feature: function resolveMountFeature($stateParams, OlService) {
        console.log($stateParams.id);

        return OlService.getRecent();
      },
    },
    // //   MountService: "MountService", 
    // //   //TODO: use this to capture the selected Mount
    // //      // translations2: function(translations, $stateParams){
    // //      //   // Assume that getLang is a service method
    // //      //   // that uses $http to fetch some translations.
    // //      //   // Also assume our url was "/:lang/home".
    // //      //   return translations.getLang($stateParams.lang);
    // //      // },
    // },
    views: {
      'planContent' :{
        templateUrl: 'templates/mount/planContent.html',
        // controller:  'MountCtrl'
      },
      'detailMenu' :{
        templateUrl: 'templates/mount/detailMenu.html', 
        controller: "MountDetailCtrl as detail",
      }
    },
  })
  // .state("plan.obstacle", {
  //   url:         "/obstacle",
  //   controller:  function(){},
  //   controllerAs: "drawCtrl",
  //   templateUrl: "templates/states/plan/plan.obstacle.html",
  // })
;});

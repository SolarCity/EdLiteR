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
      featureType: "mount"
    },
    resolve: {
      featureArray: function resolveMountFeature($stateParams, OlService) {
        console.log($stateParams.id);

        return OlService.getRecent('mount');
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
        templateUrl: 'templates/states/plan/planContent.html',
        // controller:  'MountCtrl'
      },
      'detailMenu' :{
        templateUrl: 'templates/states/plan/detailMenu.html', 
        controller: "DetailCtrl as detail",
      }
    },
  })
  .state("plan.obstruction", {
    url:         "/obstruction/:id",
    data: {
      featureType: "obstruction"
    },
    resolve: {
      featureArray: function resolveObstructionFeature($stateParams, OlService) {
        console.log($stateParams.id);

        return OlService.getRecent('obstruction');
      },
    },
    views: {
      'planContent' :{
        templateUrl: 'templates/states/plan/planContent.html',
        // controller:  'MountCtrl'
      },
      'detailMenu' :{
        templateUrl: 'templates/states/plan/detailMenu.html', 
        controller: "DetailCtrl as detail",
      }
    },
  })
  // .state("plan.obstacle", {
  //   url:         "/obstacle",
  //   controller:  function(){},
  //   controllerAs: "drawCtrl",
  //   templateUrl: "templates/states/plan/plan/plan.obstacle.html",
  // })
;});

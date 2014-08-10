angular.module('states.plan',[]).config( function StatesPlan($stateProvider) {
  $stateProvider.state("plan", {
    url:         "/plan",
    controller:  "PlanCtrl",
    controllerAs: "plan",
    templateUrl: "templates/states/plan/plan.html",
    // abstract:    true,
  })
  .state("plan.mount", {
    url:         "/mount/:selectedMount",
    controller: "MountDetailCtrl",
    controllerAs: "mount",
    resolve: {
      staticMap: function(MapService) {
        MapService.getStatic().then(function(data) {
          console.log('hi')
          return data
        });
      },
    //   MountService: "MountService", 
    //   //TODO: use this to capture the selected Mount
    //      // translations2: function(translations, $stateParams){
    //      //   // Assume that getLang is a service method
    //      //   // that uses $http to fetch some translations.
    //      //   // Also assume our url was "/:lang/home".
    //      //   return translations.getLang($stateParams.lang);
    //      // },
    },
    views: {
      'planContent' :{
        templateUrl: 'templates/mount/planContent.html',
        // controller:  'MountCtrl'
      },
      'detailMenu' :{
        templateUrl: 'templates/mount/detailMenu.html', 
        // controller:  'MountDetailCtrl'
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

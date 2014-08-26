angular.module('states.fill',[]).config( function StatesFill($stateProvider) {
  $stateProvider.state("fill", {
    url:         "/fill",
    // controller:  "",
    resolve: {
      FillService: function(PanelFillService) {
        return PanelFillService.sample;
      },
    },
    // templateUrl: "templates/states/fill/fill.html",
    template: "",
  })
;});

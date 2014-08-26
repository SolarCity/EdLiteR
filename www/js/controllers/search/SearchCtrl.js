function SearchCtrl_($scope, $state, MapService) {
  $scope.mapCreated = function(map) {
    $scope.map = map;
  };

  this.saveMapToDataUrl = function() {
    var map = MapService.getGmap(); //HACK: pop panel to cause canvas to update
                                    //      results in refresh detected by HTML2Canvas plugin
    map.controls[google.maps.ControlPosition.TOP_LEFT].pop();

    MapService.setStatic().then(function(data) {
      $scope.mapStatic = data;
      console.log($scope.mapStatic);
      $state.go('plan.type', {id:null, type:'mount'});
      
    });
  }; 
}

controllers.controller('SearchCtrl', SearchCtrl_);

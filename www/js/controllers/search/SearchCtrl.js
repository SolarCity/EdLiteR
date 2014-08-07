controllers.controller('SearchCtrl', function($scope, $state, MapService) {
  $scope.mapCreated = function(map) {
    $scope.map = map;
  };

  this.saveMapToDataUrl = function() {
  	var map = MapService.getGmap(); //HACK: pop panel to cause canvas to update
  																	//      results in refresh detected by HTML2Canvas plugin
    map.controls[google.maps.ControlPosition.TOP_LEFT].pop();

  	$scope.mapStatic = MapService.setStatic();

  	console.log($scope.mapStatic);
  	$state.go('plan.drawing');
  	
  }; 
});

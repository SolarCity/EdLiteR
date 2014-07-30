controllers.controller('PlanDrawingCtrl', ['$scope','PanelService', 'MountPlaneService', function($scope, $PS, $MP) {
  $scope.panels = $PS.testPanels;
  $scope.mountPlanes = [];

  $scope.pushToMountPlane= function(rC, rL, az, sl, or, cn) {
    $scope.mountPlanes.push($MP.MountingPlane(rC, rL, az, sl, or, cn));
    // rowCount, rowLength, azm, slope, orientation, corner
  };

  $scope.currentSelected = null;

}]);

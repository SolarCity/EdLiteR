controllers.controller('PlanDrawingCtrl', ['$scope','PanelService', 'MountPlaneService', function($scope, $PS, $MP) {
  $scope.panels = $PS.testPanels;
  $scope.mountPlanes = [];
}]);

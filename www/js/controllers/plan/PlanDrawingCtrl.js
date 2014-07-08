controllers.controller('PlanDrawingCtrl', ['$scope','PanelService', function($scope, $PS) {
  $scope.panels = $PS.testPanels;
  $scope.mounts = [];

  $scope.mounts.push($scope.panels);


}]);

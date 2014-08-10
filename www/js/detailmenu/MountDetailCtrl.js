function MountDetailCtrl_($scope, MountService) {

	console.log('hji')
	console.log($scope.layerTarget);
	$scope.layerTarget = "mount";
	console.log($scope.layerTarget);
}

controllers.controller("MountDetailCtrl", MountDetailCtrl_);

function PlanCtrl_($scope, $ionicSideMenuDelegate, FeatureOptionService) {
	var vm = this;
  vm.obstructionArray = []; //TODO: use these for vector source feature array
  vm.mountArray 			= []; //TODO: use these for vector source feature array
 
 	vm.toggleDetailView = function() {
		$ionicSideMenuDelegate.toggleRight();
	};


	// detail and feature listen for this event fired on controlbutton
	function controlbutton(e, args){
		e.preventDefault();
		$scope.$broadcast('update details', args); 
	}
	$scope.$on(	'controlbutton', controlbutton);


	// listen for radius change in detailCtrl
	function planUpdateRadius(e, args){
		vm.radius = args;
	}
	$scope.$on('new radius', planUpdateRadius);


}
controllers.controller('PlanCtrl',PlanCtrl_);

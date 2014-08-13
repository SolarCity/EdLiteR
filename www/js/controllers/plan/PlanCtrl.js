function PlanCtrl_($scope, $ionicSideMenuDelegate, $state) {
	var vm = this;
	
	// vm.targetLayer = $state.current.data.targetLayer; //TODO: where should this be? 
	vm.interactionLayer = "mount";
        console.log('ho')
 
 	vm.toggleDetailView = function() {
		$ionicSideMenuDelegate.toggleRight();
	};
	vm.stateforward = function() {
		console.log('stateforwa');
	};

}
controllers.controller('PlanCtrl',PlanCtrl_);

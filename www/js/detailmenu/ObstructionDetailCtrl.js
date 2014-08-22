function ObstructionDetailCtrl_($scope, OlService, ObstructionService) {
	var vm = this;
	vm.omap = MapService.getOmap();
	vm.featureArray = OlService.getRecent;
	vm.featureDetails = ObstructionService.obstructionOptions;
	vm.featureProperties = {};
	vm.featureId = $stateParams.id;
}
controllers.controller("ObstructionDetailCtrl", ObstructionDetailCtrl_);


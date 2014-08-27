function FillCtrl_($scope, $ionicSideMenuDelegate, fillExample, OlService, PanelFillService) {
	var vm = this;

	vm.sample = fillExample;

	// iterate over every mount Plane in the api response
	angular.forEach(vm.sample, responseIterator);

	function responseIterator(arrayOfPanels, key){
		console.log('arrayOfPanels', arrayOfPanels);
		// iterate over each panel in the array of panels
		arrayOfPanels.forEach(function(points_for_panel, key, obj){
			// turn each array of points into a WKT
			var feature = PanelFillService.panelFromJson(points_for_panel);
			var features = OlService.panels.getFeatures();

			OlService.panels.addFeature(feature);
		});

		
	}

}
controllers.controller('FillCtrl',FillCtrl_);

function FillCtrl_($scope, $ionicSideMenuDelegate, fillExample, MapService, OlService, PanelFillService) {
	var vm = this;

	vm.sample = fillExample;

	var featurestoadd = [];

	// iterate over every mount Plane in the api response
	angular.forEach(vm.sample, responseIterator);



	function responseIterator(arrayOfPanels, key){
		console.log('arrayOfPanels', arrayOfPanels);
		// iterate over each panel in the array of panels
		arrayOfPanels.forEach(function(points_for_panel, key, obj){
			// turn each array of points into a WKT
			var feature = PanelFillService.panelFromJson(points_for_panel);
			var features = OlService.panels.getFeatures();
			featurestoadd.push(feature);	
		});
	}
	OlService.panels.addFeatures(featurestoadd);	

	console.log(OlService.panels.getFeatures().length);
	// MapService.getOview().setCenter(OlService.panels.getExtent());
	// console.log(MapService.getOview().getCenter());
}
controllers.controller('FillCtrl',FillCtrl_);

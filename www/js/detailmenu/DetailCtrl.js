function DetailCtrl_($scope, $rootScope, $stateParams, $state, OlService, FeatureOptionService, MapService, StyleService, ApiService, PanelFillService) {
	var vm = this;
	var Ol = OlService;

	vm.featureProperties = {};

  vm.fillPanel = function fillPanel(feature) {
	  if (feature !== null) {
	      // if selected feature has panels, delete them
	      var id = feature.getId();
	      var panellayer = Ol.layers.panel;
	      var existing = panellayer.getFeatureById(id);
	      if (existing) {
	          Ol.removeFeatureById(id, panellayer);
	      }
	      var msg = Ol.fillMessageForSingleMount(feature);
	      // create api message with Process Features
	      var api = PanelFillService.processFeatures(msg.m, msg.o);

	      ApiService.uploadMounts(api) //TODO: change from sample
	        .then(function (data) {
	          PanelFillService.addPanelsFromApi(data, id);
	      });
	  }
	};

}

controllers.controller("DetailCtrl", DetailCtrl_);

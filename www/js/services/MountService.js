function MountService_ ($q) {
  // this service provides tools for extending mounts. 
  // 
  var MountService = {};

  MountService.mountplane = {
	  planeId: {},
	  panelOrientation: ['landscape', 'portrait'],
	  gutterHeight: {},
	  overallShading: ['heavy', 'medium', 'light', 'none'],
	  setbacks: {
	    'rule1': 'rule description', 
	    'rule2': 'rule description', 
	    'rule3': 'rule description'
	  },
	  roofType: ['composite', 'flat-tile', 'round-tile', 'rolled']
	};

	MountService.setRecent = function(feature) {
		MountService.recentFeature = feature;
		return MountService.recentFeature;
	};

	MountService.getRecent = function() {
		return MountService.recentFeature;
	};
	
	return MountService;

}
angular.module('edliter').factory('MountService', MountService_);  

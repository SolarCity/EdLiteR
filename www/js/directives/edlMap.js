function edlMap(MapService) {
  return {
    restrict: "E",
    // transclude: true,
    // scope: {
    // 	onCreate: "&"
    // },
    controller: function edlMapController($scope, $element, $attrs) {

    },
    link: function edlMapLink(scope, ele, attrs) {
    	
 
  		ionic.trigger('load google',{target: window});
      console.log(ele[0]);

    },
    template: [
    		// '<input id="place-input" class="controls" type="text" placeholder="Enter a location" />',
	    	'<div id="gmap" class="fill" edl-google-map></div>',
	    	// '<div id="omap" class="fill" edl-ol-map></div>',
    ].join('')
  };
}
directives.directive('edlMap', edlMap);

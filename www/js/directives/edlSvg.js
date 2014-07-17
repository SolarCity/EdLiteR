directives.directive('edlSvg', [ '$ionicGesture', 'd3', 'PanelService', 'MountPlaneService', function(ionicGesture, d3, ps, mp) {
  return {
    restrict: "EA",
    transclude: true,
    controller: function($scope, $element, $attrs) {
      // these are injected into child directives
      this.mapCenter   = {};
      this.rotation    = null;
      this.mountPlanes = $scope.mountPlanes;
      this.scale       = $scope.scale;
      this.svgRotation = $scope.svgRotation;
      // make the <svg> available outisde by saving it on the PanelService
      ps.svg(d3.select('svg'));
    },
    link: function(scope, ele, attrs) {
      scope.setBottomCorner = function(e) {
          console.log('bottomC');

        scope.bottomCorner = e.gesture.center;
      };
      console.log(  ele.css('position'));
      // console.log(  ele.height())
      scope.setTopCorner = function(e) {
          console.log('topC');
        
        scope.topCorner = e.gesture.center;
      };

      var cornerSetter = function(e){
        if (!scope.bottomCorner){
          scope.setBottomCorner(e);
        } else if (!scope.topCorner){
          scope.setTopCorner(e);
        } else {
          scope.topCorner = null;
          scope.bottomCorner = null;
          console.log('erasing corners');
          scope.setBottomCorner(e);
        }
      };

      ionicGesture.on('touch', cornerSetter, ele);
    },
    template: [
          '<div>',
            // '<input id="place-input" class="controls" type="text" placeholder="Enter a location">',
            // '<edl-map on-create="mapCreated(map)" id="map-canvas"></edl-map>',
            '<svg >',
              '<g> ',
              '<g z-index="40" edl-mount  ',
                'ng-repeat="plane in mountPlanes"  ',
                'plane="plane" ',
                'position="position" ',
                 '> ',
              '</g> ',
              '</g> ',
            '</svg>',
          '</div>'
      ].join('')
  };
}]);

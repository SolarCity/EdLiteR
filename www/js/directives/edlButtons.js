directives.directive('edlButtons', [ '$ionicGesture', 'd3', 'PanelService', 'MountPlaneService', function( ionicGesture, d3, ps, mp) {
  return {
    restrict: "EA",
    transclude: true,
    controller: function($scope, $element, $attrs) {
      $scope.onDrag = function (){
        console.log('controller try',$scope.rotate);
        $scope.rotate +=1;
      }
    },
    link: function (scope, ele, attrs, edlMount) {
      // get the <svg> from PanelService
      var rowCount = 3, rowLength = 4, azm = 0, slope = 0, orientation = "landscape", corner =  {lat: 75, lon: 75};


      scope.addMP = function() {
        location = location || {lat: 150, lon: 150};
        scope.mountPlanes.push(mp.MountingPlane(rowCount, rowLength, azm, slope, orientation, corner));
        console.log(scope.mountPlanes)
      }

      scope.tell = function() {
        console.log(scope.mountPlanes);
      }
    },
    template: '<div> \
                <div class="edl buttons" style=" float: right; width: 10%; padding-top: 44px" > \
                <button class="button button-full button-positive" ng-click="addMP()"  >add MP</button> \
                <button class="button button-full button-positive" ng-click="rotate()" on-drag="onDrag()" dragging="{{dragging}}">rotate</button> \
                <button class="button button-full button-positive" ng-click="tell()" on-drag="onDrag()" dragging="{{dragging}}">rotate</button> \
                </div> \
              </div>'
  };
}]);

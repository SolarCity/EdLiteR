directives.directive('edlD3', [ '$ionicGesture', 'd3', function(ionicGesture, d3) {
  return {
    restrict: "EA",
    link: function (scope, ele, attrs) {
      var svg = d3.select(ele[0])
          .append('svg')
          .style('width', '100%');

      ionicGesture.on('drag', function(e){
        console.log(e.gesture)
      }, ele);
    }
  };
}]);

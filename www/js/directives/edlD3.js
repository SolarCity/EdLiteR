directives.directive('edlD3', [ 'd3', function(d3) {
  return {
    restrict: "EA",
    link: function (scope, ele, attrs) {
      var svg = d3.select(ele[0])
          .append('svg')
          .style('width', '100%');

      svg.on("click", function() {
        console.log('click');
      })
      // hard-code data
      scope.data = [
        {name: "Greg", score: 98},
        {name: "Ari", score: 96},
        {name: 'Q', score: 75},
        {name: "Loser", score: 48}
      ];
    }
  };
}]);

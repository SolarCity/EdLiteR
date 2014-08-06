controllers.controller('SearchCtrl', function($scope, $state, MapService) {
  $scope.mapCreated = function(map) {
    $scope.map = map;
  };

  this.saveMapToDataUrl = function() {
  	$scope.mapStatic = MapService.setStatic();
  	console.log($scope.mapStatic)
  	$state.go('plan.drawing');
  	
  };

  // function (element) {
  //   element = document.getElementById('gmap');
  //   html2canvas(element , {
  //     useCORS: true,
  //     onrendered: function(canvas) {
  //       var dataUrl= canvas.toDataURL("image/png");
  //       console.log(dataUrl);
  //       // DO SOMETHING WITH THE DATAURL
  //       // Eg. write it to the page
  //       document.write('<img class="fill" src="' + dataUrl + '"/>');
  //     }
  //   });
  // };
 

});






// var pixelProjection = new ol.proj.Projection({
// 	  code: 'pixel',
// 	  units: 'pixels',
// 	  extent: [0, 0, 670, 647]
// 	});
// var map = new ol.Map({
// 	  target: 'map',
// 	  layers: [ new ol.layer.Image({
// 	  	source: new ol.source.ImageStatic({
// 		  		url: 'de_haro_test_image.PNG',
// 		  		imageSize: [670, 647],
// 		      projection: pixelProjection,
// 		      imageExtent: pixelProjection.getExtent()
// 		  	})
// 	  	})
// 	  ],
// 	  view: new ol.View({
// 	    projection: pixelProjection,
// 	    center: ol.extent.getCenter(pixelProjection.getExtent()),
// 	    zoom: 2
// 	  })
// 	});
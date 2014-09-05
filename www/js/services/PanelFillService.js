function PanelFillService_ ($q, $window, OlService, MapService, ApiService) {
  // this Service provides styles, etc for edlOlMap features
  var PanelFillService = {};

  // well known text format utility
  wkt = OlService.wkt;

  /* 
   * functions we use
   */

  PanelFillService.processFeatures = function(features){
  	var msg = {};
  	msg.m = [];
  	for (var idx in features) {
  		var p = [];
  		for (var point in features[idx]){ 
  			p.push(PanelFillService.pointToLatLng(features[idx][point], idx, features));
				
  		}
  		msg.m.push({
					id: idx, 
					pitch: 'pitch',
					points: p,
				});
  	}
		return msg;
  };

	PanelFillService.pointToLatLng = function(point_string, featIdx, featCollection) {
		//TODO: is it a problem that browser zoom impacts these numbers?
		var pt_xy	= point_string.split(' ');

		var north_edge, south_edge, east_edge, west_edge, pixelHeight, pixelWidth;
		north_edge = 0;
		west_edge  = 0;
		east_edge  = $window.innerWidth;
		south_edge = OlService.mapDiv.clientHeight;
		pixelWidth = $window.innerWidth;
		pixelHeight = OlService.mapDiv.clientHeight;
		var mapCornerExtent;
		mapCornerExtent = MapService.g.bounds ? MapService.g.bounds : [0, 0, $window.innerWidth, OlService.mapDiv.clientHeight ];
		var pixelExtentXY01 = [0, 0, $window.innerWidth, OlService.mapDiv.clientHeight ];
		var enws_deg_extent = [];
		if (!Array.isArray(mapCornerExtent)) { //TODO: ?? extract this to MapService
			north_edge = mapCornerExtent.getNorthEast().lat();
			south_edge = mapCornerExtent.getSouthWest().lat();
			east_edge  = mapCornerExtent.getNorthEast().lng();
			west_edge  = mapCornerExtent.getSouthWest().lng();
			enws_deg_extent = [
				mapCornerExtent.getNorthEast().lng(), // degX0 east_edge
				mapCornerExtent.getNorthEast().lat(), // degY0 north_edge
				mapCornerExtent.getSouthWest().lng(), // degX1 west_edge
				mapCornerExtent.getSouthWest().lat(), // degY1 south_edge
			];
		} else {
			enws_deg_extent = mapCornerExtent;
		}

		// map measure in degrees
		var e_mapsize = Math.abs(east_edge - west_edge);
		var n_mapsize = Math.abs(north_edge - south_edge);
		var en_mapsize = [e_mapsize, n_mapsize];

		// ratio pixels on map : degrees on map = px/dg
		var px_per_e = pixelWidth  / e_mapsize;
		var px_per_n = pixelHeight / n_mapsize;
		var px_per_en = [px_per_e, px_per_n];

		function north_pt(pt_y) {
			return south_edge + pt_y / px_per_n;
		}

		function east_pt(pt_x) {
			return west_edge + pt_x / px_per_e;
		}

		function point_machine(pt_xy){
			return [east_pt(pt_xy[0]), north_pt(pt_xy[1])].join(',');
		}

		return point_machine(pt_xy);
  };

  // turn json into WKT ==> POLYGON((159 569,541 576,554 286,193 271,159 569)) 
	PanelFillService.panelFromJson = function(array_of_points){
		var feature_to_return;
		var pts = array_of_points;
		var north_edge, south_edge, east_edge, west_edge, pixelHeight, pixelWidth;
		north_edge = 0;
		west_edge  = 0;
		east_edge  = $window.innerWidth;
		south_edge = OlService.mapDiv.clientHeight;
		pixelWidth = $window.innerWidth;
		pixelHeight = OlService.mapDiv.clientHeight;

		var mapCornerExtent;
		mapCornerExtent = MapService.g.bounds ? MapService.g.bounds : [0, 0, $window.innerWidth, OlService.mapDiv.clientHeight ];
		var pixelExtentXY01 = [0, 0, $window.innerWidth, OlService.mapDiv.clientHeight ];
		var enws_deg_extent = [];
		if (!Array.isArray(mapCornerExtent)) { //TODO: ?? extract this to MapService
			north_edge = mapCornerExtent.getNorthEast().lat();
			south_edge = mapCornerExtent.getSouthWest().lat();
			east_edge  = mapCornerExtent.getNorthEast().lng();
			west_edge  = mapCornerExtent.getSouthWest().lng();
			enws_deg_extent = [
				mapCornerExtent.getNorthEast().lng(), // degX0 east_edge
				mapCornerExtent.getNorthEast().lat(), // degY0 north_edge
				mapCornerExtent.getSouthWest().lng(), // degX1 west_edge
				mapCornerExtent.getSouthWest().lat(), // degY1 south_edge
			];
		} else {
			enws_deg_extent = mapCornerExtent;
		}

		// map measure in degrees
		var e_mapsize = Math.abs(east_edge - west_edge);
		var n_mapsize = Math.abs(north_edge - south_edge);
		var en_mapsize = [e_mapsize, n_mapsize];

		// ratio pixels on map : degrees on map = px/dg
		var px_per_e = pixelWidth  / e_mapsize;
		var px_per_n = pixelHeight / n_mapsize;
		var px_per_en = [px_per_e, px_per_n];

		function pointJoin(pointCoordLngLat){
			var pt_e  = pointCoordLngLat[0]; // -122.26724295911637
			var pt_n = pointCoordLngLat[1]; //   37.483464075107776			
			// (en_pt_on_map) * K = new point
			var result = [
				 (pt_e - west_edge ) * px_per_e ,
			   pixelHeight - ((north_edge - pt_n) * px_per_n) ,
			].join(' ');

			return result;
		}
		// create a string with the proper start and end
		var wkt_string_from_points_array = [
      	pointJoin(pts[0]),
      	pointJoin(pts[1]),
      	pointJoin(pts[2]),
      	pointJoin(pts[3]),
      	pointJoin(pts[0]),
    ].join(', ');

    // add the right begin & end details
    wkt_string_from_points_array = "POLYGON((" + wkt_string_from_points_array + "))";

		feature_to_return = wkt.readFeature(wkt_string_from_points_array); //TODO: projection?
		var fCoord = feature_to_return.getGeometry().getCoordinates();

		return feature_to_return;
  };

  return PanelFillService;
}

angular.module('edliter').service('PanelFillService', PanelFillService_);  

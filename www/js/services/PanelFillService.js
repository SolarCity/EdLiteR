function PanelFillService_ ($q, OlService, MapService) {
  // this Service provides styles, etc for edlOlMap features
  var PanelFillService = {};

  [[159, 569],
    [541, 576],
    [554, 286],
    [193, 271]]

  // PanelFillService.sample = {"0":[[[-122.2673599891102,37.483443610459965],[-122.26734402107655,37.483451518440447],[-122.26735468366822,37.4834368646639],[-122.26733871563542,37.483444772643665]],[[-122.26734402107655,37.483451518440447],[-122.26732805303951,37.483459426418776],[-122.26733871563542,37.483444772643665],[-122.26732274759928,37.483452680621284]],[[-122.26732805303951,37.483459426418776],[-122.26731208499909,37.483467334394952],[-122.26732274759928,37.483452680621284],[-122.26730677955972,37.483460588596749]],[[-122.26731208499909,37.483467334394952],[-122.26729611695528,37.483475242368989],[-122.26730677955972,37.483460588596749],[-122.2672908115168,37.483468496570062]],[[-122.26729611695528,37.483475242368989],[-122.26728014890809,37.483483150340867],[-122.2672908115168,37.483468496570062],[-122.26727484347049,37.483476404541243]],[[-122.26728014890809,37.483483150340867],[-122.26726418085754,37.4834910583106],[-122.26727484347049,37.483476404541243],[-122.26725887542081,37.483484312510249]],[[-122.26737065169762,37.483428956681983],[-122.26735468366822,37.4834368646639],[-122.26736534625569,37.483422210886388],[-122.26734937822717,37.483430118867595]],[[-122.26735468366822,37.4834368646639],[-122.26733871563542,37.483444772643665],[-122.26734937822717,37.483430118867595],[-122.26733341019526,37.483438026846649]],[[-122.26733871563542,37.483444772643665],[-122.26732274759928,37.483452680621284],[-122.26733341019526,37.483438026846649],[-122.26731744215998,37.48344593482355]],[[-122.26732274759928,37.483452680621284],[-122.26730677955972,37.483460588596749],[-122.26731744215998,37.48344593482355],[-122.26730147412131,37.483453842798305]],[[-122.26730677955972,37.483460588596749],[-122.2672908115168,37.483468496570062],[-122.26730147412131,37.483453842798305],[-122.26728550607928,37.4834617507709]],[[-122.2672908115168,37.483468496570062],[-122.26727484347049,37.483476404541243],[-122.26728550607928,37.4834617507709],[-122.26726953803384,37.483469658741356]],[[-122.26727484347049,37.483476404541243],[-122.26725887542081,37.483484312510249],[-122.26726953803384,37.483469658741356],[-122.26725356998504,37.483477566709659]],[[-122.26738131428084,37.48341430290305],[-122.26736534625569,37.483422210886388],[-122.26737600883898,37.483407557107931],[-122.26736004081474,37.483415465090566]],[[-122.26736534625569,37.483422210886388],[-122.26734937822717,37.483430118867595],[-122.26736004081474,37.483415465090566],[-122.26734407278708,37.483423373071055]],[[-122.26734937822717,37.483430118867595],[-122.26733341019526,37.483438026846649],[-122.26734407278708,37.483423373071055],[-122.26732810475605,37.483431281049391]],[[-122.26733341019526,37.483438026846649],[-122.26731744215998,37.48344593482355],[-122.26732810475605,37.483431281049391],[-122.26731213672164,37.483439189025567]],[[-122.26731744215998,37.48344593482355],[-122.26730147412131,37.483453842798305],[-122.26731213672164,37.483439189025567],[-122.26729616868387,37.483447096999619]],[[-122.26730147412131,37.483453842798305],[-122.26728550607928,37.4834617507709],[-122.26729616868387,37.483447096999619],[-122.2672802006427,37.483455004971511]],[[-122.26728550607928,37.4834617507709],[-122.26726953803384,37.483469658741356],[-122.2672802006427,37.483455004971511],[-122.26726423259817,37.483462912941256]],[[-122.26726953803384,37.483469658741356],[-122.26725356998504,37.483477566709659],[-122.26726423259817,37.483462912941256],[-122.26724826455023,37.483470820908842]],[[-122.26739197685986,37.483399649123143],[-122.26737600883898,37.483407557107931],[-122.2673866714181,37.483392903328522],[-122.2673707033981,37.483400811312578]],[[-122.26737600883898,37.483407557107931],[-122.26736004081474,37.483415465090566],[-122.2673707033981,37.483400811312578],[-122.2673547353747,37.4834087192945]],[[-122.26736004081474,37.483415465090566],[-122.26734407278708,37.483423373071055],[-122.2673547353747,37.4834087192945],[-122.26733876734794,37.483416627274273]],[[-122.26734407278708,37.483423373071055],[-122.26732810475605,37.483431281049391],[-122.26733876734794,37.483416627274273],[-122.2673227993178,37.4834245352519]],[[-122.26732810475605,37.483431281049391],[-122.26731213672164,37.483439189025567],[-122.2673227993178,37.4834245352519],[-122.26730683128429,37.483432443227372]],[[-122.26731213672164,37.483439189025567],[-122.26729616868387,37.483447096999619],[-122.26730683128429,37.483432443227372],[-122.26729086324737,37.483440351200692]],[[-122.26729616868387,37.483447096999619],[-122.2672802006427,37.483455004971511],[-122.26729086324737,37.483440351200692],[-122.2672748952071,37.483448259171873]],[[-122.2672802006427,37.483455004971511],[-122.26726423259817,37.483462912941256],[-122.2672748952071,37.483448259171873],[-122.26725892716343,37.4834561671409]],[[-122.26726423259817,37.483462912941256],[-122.26724826455023,37.483470820908842],[-122.26725892716343,37.4834561671409],[-122.26724295911637,37.483464075107776]],[[-122.26740263943472,37.483384995342291],[-122.2673866714181,37.483392903328522],[-122.26739733399302,37.483378249548132],[-122.26738136597727,37.483386157533637]],[[-122.2673866714181,37.483392903328522],[-122.2673707033981,37.483400811312578],[-122.26738136597727,37.483386157533637],[-122.26736539795817,37.483394065516983]],[[-122.2673707033981,37.483400811312578],[-122.2673547353747,37.4834087192945],[-122.26736539795817,37.483394065516983],[-122.26734942993565,37.4834019734982]],[[-122.2673547353747,37.4834087192945],[-122.26733876734794,37.483416627274273],[-122.26734942993565,37.4834019734982],[-122.26733346190976,37.483409881477264]],[[-122.26733876734794,37.483416627274273],[-122.2673227993178,37.4834245352519],[-122.26733346190976,37.483409881477264],[-122.2673174938805,37.483417789454165]],[[-122.2673227993178,37.4834245352519],[-122.26730683128429,37.483432443227372],[-122.2673174938805,37.483417789454165],[-122.26730152584787,37.48342569742892]],[[-122.26730683128429,37.483432443227372],[-122.26729086324737,37.483440351200692],[-122.26730152584787,37.48342569742892],[-122.26728555781185,37.48343360540153]],[[-122.26729086324737,37.483440351200692],[-122.2672748952071,37.483448259171873],[-122.26728555781185,37.48343360540153],[-122.26726958977244,37.483441513372007]],[[-122.2672748952071,37.483448259171873],[-122.26725892716343,37.4834561671409],[-122.26726958977244,37.483441513372007],[-122.26725362172965,37.483449421340318]],[[-122.26725892716343,37.4834561671409],[-122.26724295911637,37.483464075107776],[-122.26725362172965,37.483449421340318],[-122.2672376536835,37.483457329306482]],[[-122.26724295911637,37.483464075107776],[-122.26722699106595,37.483471983072512],[-122.2672376536835,37.483457329306482],[-122.26722168563393,37.483465237270494]]]};
  PanelFillService.sample = {"0":[[[159, 569],    [541, 576],    [554, 286],    [193, 271]]]};
  
  // well known text format utility
  wkt = OlService.wkt;

	PanelFillService.fillMountPlane = function(jsonObj) {

		
		
  };

  // turn json into WKT ==> POLYGON((159 569,541 576,554 286,193 271,159 569)) 
	PanelFillService.panelFromJson = function(array_of_points){
		var feature_to_return;
		var pts = array_of_points;
		// utility function //TODO: make this avail elsehwere? 
		function pointJoin(pointCoord){
			var result = [
				pointCoord[0], 
				pointCoord[1]
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


    var projection = new ol.proj.Projection({
    	code: 'EPSG:4326'
    });
    wkt_options = {
    	dataProjection: projection,
    	featureProjection: undefined,
    };

    // turn it into an OL feature 

		feature_to_return = wkt.readFeature(wkt_string_from_points_array, wkt_options); //TODO: projection?

		return feature_to_return;
  };

  return PanelFillService;
}

angular.module('edliter').service('PanelFillService', PanelFillService_);  

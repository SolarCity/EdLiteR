function MountService_ () {
  // this service provides tools for extending mounts. 
  // 
  this.mountOptions = [{
		propertyName: "Panel Orientation",
		propertyValue: "panelOrientation",
		options: [{
			value: "landscape",
			text:  "Landscape"
		},{
			value: "portrait",
			text:  "Portrait"
		}]
	},{
		propertyName: "Gutter Height",
		propertyValue: "gutterHeight",
		options:  [{value: "fixme", text: "fixme"}]
	},{
		propertyName: "Overall Shading",
		propertyValue: "overallShading",
		options: [{
			value: "heavy",
			text:  "Heavy"
		},{
			value: "medium",
			text:  "Medium"
		},{
			value: "little",
			text:  "Little"
		},{
			value: "none",
			text:  "None"
		}]
	},{
		propertyName: "Roof Type",
		propertyValue: "roofType",
		options: [{
			value: "composite",
			text:  "Composite"
		},{
			value: "flat-tile",
			text:  "Flat Tile"
		},{
			value: "round-tile",
			text:  "Round Tile"
		},{
			value: "rolled",
			text:  "Rolled Roof"
		}]
	},{
		propertyName: "AHJ",
		propertyValue: "AHJ",
		options: [{value: "fixme", text: "fixme"}]
	},{
		propertyName: "planeId",
		propertyValue: "MP#",
		options: [{value: "fixme", text: "fixme"}]
	}];

}
angular.module('edliter').service('MountService', MountService_);  

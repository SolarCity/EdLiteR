var app = angular.module('edliter', [
  'ionic',
  'd3',
  'ui.bootstrap',
  'states',
  'app.factories',
  'app.services',
  'app.controllers',
  'app.directives',
  'app.options',
]).run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

var factories   = angular.module('app.factories',[]);
var services    = angular.module('app.services',[]);
var controllers = angular.module('app.controllers',[]);
var directives  = angular.module('app.directives',['d3']);
var options     = angular.module('app.options',[]);



// hardcodes
var panelOpts = {
  svg          : null,
  centers      : null,
  screenSize   : null,
  panelSize    : null,
  panelLength  : 75,
  panelHeight  : 30,
  scale        : 1,
  testPanels   : [[10,10],[50,50],[90,90],[130,130],[170,170],[210,210],[250,250]],
}

options.value('panelOpts', panelOpts);

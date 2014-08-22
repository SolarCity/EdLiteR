angular.module('edliter', [
  'ionic',
  'ui.bootstrap',
  'states',
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
    // if(window.StatusBar) {
    //   StatusBar.styleDefault();
    // }
  });
});

var controllers = angular.module('app.controllers',[]);
var directives  = angular.module('app.directives',[]);
var options     = angular.module('app.options',[]);

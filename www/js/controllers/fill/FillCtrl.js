function FillCtrl_($scope, $ionicSideMenuDelegate, FillService) {
	var vm = this;
 
	FillService['0'].forEach(function(a,b,c){
		console.log(a,b,c);
	})

}
controllers.controller('FillCtrl',FillCtrl_);

function ApiService_ ($http, $q) {
  // this Service provides Api access
  var ApiService = {};

  var baseUrl = "http://scexchange.solarcity.com/scfilefactory/testfill.aspx";

  ApiService.uploadMounts = function(data) {
  	var deferred = $q.defer();
    var x = {};

    x = JSON.stringify(data);

    $.ajax({
    type: "POST",
    url: baseUrl,
    data: {
        "TestJSON": x
    },
    success: function(data){
        var t = JSON.parse(data);
        deferred.resolve(t);
      }
    });

    return deferred.promise;
  };

  return ApiService;
}

angular.module('edliter').service('ApiService', ApiService_);  
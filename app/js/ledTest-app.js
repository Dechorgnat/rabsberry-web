/**
 * Created by arid6405 on 02/02/18.
 */
var app = angular.module('ledTestApp', ['ngResource']);

app.config(['$resourceProvider', function ($resourceProvider) {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

app.controller('headerCtrl', headerCtrl);

app.controller('ledTestCtrl', function ($scope, $http) {
    $scope.submitted = false;
    $scope.event = {};

    $scope.send = function (form) {
        $scope.submitted = true;
        if (form.$valid) {
            console.log("form is valid");
            $scope.event.actor_type="LED_SIM";
            var data = JSON.stringify($scope.event);
            $http({
                method: "post",
                url: "../api/event",
                data: data,
                headers: {
                    "Content-type": "application/json",
                    "Content-length": data.length
                }
            })
                .success(function (data, status) {
                    alert("ok: " + data);
                })
                .error(function (data, status) {
                    alert("failed (" + status + "): " + data);
                });
        } else
            console.error("form is not valid");
    }

  $scope.selectPattern = function() {
    $scope.showColor1 = true;
    $scope.showColor2 = false;
    $scope.showParams = true;
    switch (parseInt($scope.pattern)){
      case 0: //stop
        $scope.showParams = false;
        break;
      case 1: //chase
      case 2: //chase_reverse
      case 4: //all_pulse
      case 5: //triangle
        $scope.showPeriod = true;
        $scope.showLite = false;
        $scope.showDark = false;
        break;
      case 3: //all_blink
        $scope.showPeriod = false;
        $scope.showLite = true;
        $scope.showDark = true;
        break;
    }
  }

  $scope.getCommand = function() {
    var color1 = hexToRgb($scope.color1);

    switch ($scope.pattern){
      case 0: //stop
        $scope.command = "0;";
        break;
      case 1: //chase
      case 2: //chase_reverse
      case 4: //all_pulse
      case 5: //triangle
        $scope.command = [$scope.pattern, $scope.period, color1.r, color1.g, color1.b].join(',');
        break;
      case 3: //all_blink
        $scope.command = [$scope.pattern, $scope.period, color1.r, color1.g, color1.b].join(',');
        break;
    }
  }

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : {r:0,g:0,b:0};
  }
});

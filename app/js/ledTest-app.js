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
});

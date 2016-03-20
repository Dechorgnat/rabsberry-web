/**
 * Created by arid6405 on 08/02/16.
 */
var app = angular.module('simulatorApp', ['ngResource']);

app.config(['$resourceProvider', function ($resourceProvider) {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

app.controller('simulatorCtrl', function ($scope, $http) {

    /*
     actor-type: RFID_READER
     actor-id: mir:ror
     action: IN | OUT | ON | OFF
     tag-id: '0' if no tag event
     */

    $scope.event = {};
    $scope.actor_types = ['RFID_READER', 'TOP_BUTTON'];
    $scope.actions = [];
    $scope.actions['RFID_READER'] = ['IN', 'OUT', 'ON', 'OFF'];
    $scope.actions['TOP_BUTTON'] = ['SHORT_PRESSED', 'LONG_PRESSED'];

    $scope.send = function (form) {
        $scope.submitted = true;
        if (form.$valid) {
            console.log("form is valid");
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
/**
 * Created by arid6405 on 2019/01/29.
 */
var connected_flag = 0;
var mqtt;
var reconnectTimeout = 2000;

var app = angular.module('mqttApp', ['ngResource']);

app.config(['$resourceProvider', function ($resourceProvider) {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

app.controller('headerCtrl', headerCtrl);

app.controller('mqttCtrl', function ($scope, $timeout) {
    $scope.host = "192.168.1.65";
    $scope.port = 9001;

    $scope.MQTTconnect = function () {
        $scope.messages = "";
        console.log("connecting to ws://" + $scope.host + ":" + $scope.port);
        mqtt = new Paho.MQTT.Client($scope.host, $scope.port, "IhmTest");
        var options = {
            timeout: 3,
            onSuccess: onConnect,
            onFailure: onFailure,
        };

        mqtt.onConnectionLost = onConnectionLost;
        mqtt.onMessageArrived = onMessageArrived;
        mqtt.onConnected = onConnected;
        mqtt.connect(options);
    }

    function onConnect() {
        // Once a connection has been made, make a subscription and send a message.
        $timeout(function () {
            $scope.messages = "Connected to " + $scope.host + "on port " + $scope.port;
            connected_flag = 1;
            $scope.status = "Connected";
            console.log("on Connect " + connected_flag);
        }, 0);
    }

    function onFailure(message) {
        console.log("Failed");
        $scope.messages = "Connection Failed- Retrying";
        setTimeout($scope.MQTTconnect, reconnectTimeout);
    }

    function onConnectionLost() {
        console.log("connection lost");
        $scope.status = "Connection Lost";
        $scope.message = "Connection Lost";
        connected_flag = 0;
    }

    function onMessageArrived(r_message) {
        out_msg = "Message received " + r_message.payloadString + "<br>";
        out_msg = out_msg + "Message received Topic " + r_message.destinationName;
        //console.log("Message received ",r_message.payloadString);
        console.log(out_msg);
        $scope.message = out_msg;
    }

    function onConnected(recon, url) {
        console.log(" in onConnected " + reconn);
    }

    function subTopic() {
        $scope.message = "";
        if (connected_flag == 0) {
            out_msg = "<b>Not Connected so can't subscribe</b>";
            console.log(out_msg);
            $scope.message = out_msg;
            return false;
        }
        var stopic = $scope.Stopic;
        console.log("Subscribing to topic =" + stopic);
        mqtt.subscribe(stopic);
        return false;
    }

    function sendMessage() {
        $scope.message = "";
        if (connected_flag == 0) {
            out_msg = "<b>Not Connected so can't send</b>";
            console.log(out_msg);
            $scope.message = out_msg;
            return false;
        }
        var msg = $scope.message;
        console.log(msg);
        message = new Paho.MQTT.Message(msg);
        message.destinationName = $scope.Ptopic;
        mqtt.send(message);
        return false;
    }
});
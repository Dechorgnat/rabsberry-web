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

    $scope.channel ='leds';

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
    };

    function onConnect() {
        // Once a connection has been made, make a subscription and send a message.
        $timeout(function () {
            $scope.messages = "Connected to " + $scope.host + " on port " + $scope.port;
            connected_flag = 1;
            $scope.status = "Connected";
            console.log("on Connect " + connected_flag);
        }, 0);
    }

    function onFailure(message) {
        $timeout(function () {console.log("Failed");
            $scope.messages = "Connection Failed - Retrying";
            setTimeout($scope.MQTTconnect, reconnectTimeout);
        }, 0);
    }

    function onConnectionLost() {
        $timeout(function () {console.log("Failed");
            console.log("connection lost");
            $scope.status = "Connection Lost";
            $scope.messages = "Connection Lost";
            connected_flag = 0;
        }, 0);
    }

    function onMessageArrived(r_message) {
        $timeout(function () {console.log("Failed");
            out_msg = "Message received: ["+r_message.destinationName+"] " + r_message.payloadString;
            //console.log("Message received ",r_message.payloadString);
            console.log(out_msg);
            $scope.messages = out_msg;
        }, 0);
    }

    function onConnected(recon, url) {
        console.log(" in onConnected " + reconn);
    }

    $scope.subTopic = function() {
        $scope.messages = "";
        if (connected_flag == 0) {
            out_msg = "<b>Not Connected so can't subscribe</b>";
            console.log(out_msg);
            $scope.messages = out_msg;
            return false;
        }
        var stopic = $scope.Stopic;
        console.log("Subscribing to topic " + stopic);
        mqtt.subscribe(stopic);
        return false;
    };

    $scope.sendMessage = function() {
        $scope.messages = "";
        if (connected_flag == 0) {
            out_msg = "<b>Not Connected so can't send</b>";
            console.log(out_msg);
            $scope.messages = out_msg;
            return false;
        }
        if ($scope.channel == 'leds') {
            var jsonMsg = {command: $scope.command_leds};
            if (($scope.command_leds == 'set') || ($scope.command_leds == 'unset')) {
                jsonMsg.leds = $scope.leds;
            }
            if ($scope.command_leds == 'set') {
                jsonMsg.r = parseInt($scope.r);
                jsonMsg.g = parseInt($scope.g);
                jsonMsg.b = parseInt($scope.b);
            }
        }
        if ($scope.channel == 'ears') {
            var jsonMsg = {command: $scope.command_ears};
            if (($scope.command_ears == 'goto') || ($scope.command_ears == 'step')) {
                jsonMsg.ear = $scope.ear;
                jsonMsg.pos = parseInt($scope.pos);
                jsonMsg.dir = $scope.dir;
            }
        }
        console.log(jsonMsg);
        $scope.message = JSON.stringify(jsonMsg);

        message = new Paho.MQTT.Message($scope.message);
        message.destinationName = $scope.channel;
        mqtt.send(message);
        return false;
    }
});

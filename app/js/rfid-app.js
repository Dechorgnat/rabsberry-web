/**
 * Created by arid6405 on 08/02/16.
 */
var app= angular.module('rfidApp',['ngResource']);

app.config(['$resourceProvider', function($resourceProvider) {
  // Don't strip trailing slashes from calculated URLs
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

app.factory('Rfid', ['$resource', function($resource) {
    return $resource(
        '/api/rfids/:id/',
        { id: '@id' },
        {
            'update': { method:'PUT' },
            'query': {
                isArray: true,
                method: 'GET',
                params: {},
                transformResponse: function (data) {
                  return angular.fromJson(data).data
                }
            }
        });
    }]);

app.controller('headerCtrl', headerCtrl);

app.controller('rfidCtrl', function($scope, Rfid){
    $scope.refresh = function(){
        $scope.rfids = Rfid.query();
    }

    $scope.editRfid = function(rfid){
        $scope.rfid = Rfid.get({'id':rfid.id});
    }
    $scope.cancelEditRfid = function(){
        $scope.rfid = false;
    }

    $scope.saveRfid = function(){
        $scope.rfid.$update();
        $scope.refresh();
        $scope.rfid = false;
    }

    $scope.removeRfid = function(rfid){
        var result = confirm("Etes vous sûr de vouloir supprimer le tag "+rfid.rfid_id+": "+rfid.desc+" ?");
        if (result===true) {
            Rfid.delete({"id": rfid.id});
            $scope.refresh();
        }
    }

    $scope.refresh();
    $scope.rfid = false;
});
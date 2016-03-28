/**
 * Created by Alain on 27/03/16.
 */
function headerCtrl($scope, $location)
{
    $scope.isActive = function (viewLocation) {

        return $location.absUrl().match(viewLocation+"$");
        //return viewLocation === $location.path();
    };
}

/**
 * Created by Alain on 27/03/16.
 */
function headerController($scope, $location)
{
    $scope.isActive = function (viewLocation) {

        return $location.path().indexOf(viewLocation) == 0;
        //return viewLocation === $location.path();
    };
}
angular.module('cardManagementModule').directive('cardTile',[function(){
return{
restrict:'E',
scope:{card:'='},
templateUrl:'src/app/card-management/card-tile.html'
};
}]);
angular.module('kpiModule').directive('kpiCard',[function(){
return{
restrict:'E',
scope:{kpi:'='},
templateUrl:'src/app/kpi/kpi-card.html'
};
}]);
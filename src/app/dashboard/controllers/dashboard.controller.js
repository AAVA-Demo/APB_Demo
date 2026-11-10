(function(){
'use strict';
angular.module('app.dashboard').controller('DashboardController',['KPIService','$scope','$interval',function(KPIService,$scope,$interval){
var vm=this;
vm.kpis={};
vm.loading=true;
vm.error=null;
function loadKPIs(){
KPIService.getAggregatedKPIs().then(function(data){
vm.kpis=data;
vm.loading=false;
},function(err){
vm.error='Failed to load dashboard KPIs';
vm.loading=false;
});
}
loadKPIs();
$interval(loadKPIs,600000);
}]);
})();
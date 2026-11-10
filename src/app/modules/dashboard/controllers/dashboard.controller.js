(function(){
'use strict';
angular.module('creditCard.dashboard').controller('DashboardController',['DashboardService','$scope','$interval',function(DashboardService,$scope,$interval){
const vm=this;
vm.kpis={};
vm.loading=true;
vm.error=null;
vm.refresh=function(){
vm.loading=true;
DashboardService.getDashboardKPIs(true).then(function(kpis){
vm.kpis=kpis;
vm.loading=false;
}).catch(function(err){
vm.error='Failed to load dashboard data';
vm.loading=false;
});
};
vm.refresh();
const autoRefresh=$interval(vm.refresh,300000);
$scope.$on('$destroy',function(){$interval.cancel(autoRefresh);});
}]);
})();
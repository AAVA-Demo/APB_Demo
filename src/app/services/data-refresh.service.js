(function(){
'use strict';
angular.module('creditCardApp').service('DataRefreshService',['$interval','KPIService',function($interval,KPIService){
var vm=this;
var refreshInterval=null;
vm.startPolling=function(callback){
if(refreshInterval){
vm.stopPolling();
}
refreshInterval=$interval(function(){
KPIService.getKPIs().then(function(kpiData){
if(callback){
callback(kpiData);
}
});
},30000);
};
vm.stopPolling=function(){
if(refreshInterval){
$interval.cancel(refreshInterval);
refreshInterval=null;
}
};
}]);
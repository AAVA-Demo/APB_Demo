(function(){
'use strict';
angular.module('creditCardApp').service('RefreshService',['$interval','KPIService','AuthService',function($interval,KPIService,AuthService){
var self=this;
var refreshInterval=null;
self.startPolling=function(callback){
if(refreshInterval)return;
refreshInterval=$interval(function(){
var userId=AuthService.getUserId();
if(userId){
KPIService.getKPIs(userId).then(function(data){
if(callback)callback(data);
});
}
},300000);
};
self.stopPolling=function(){
if(refreshInterval){
$interval.cancel(refreshInterval);
refreshInterval=null;
}
};
}]);
})();
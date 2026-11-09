(function(){
'use strict';
angular.module('creditCardApp').service('refreshService',['$interval','$rootScope','cardDataService',function($interval,$rootScope,cardDataService){
var refreshInterval=null;
this.startPolling=function(){
if(refreshInterval)return;
refreshInterval=$interval(function(){
cardDataService.getDashboardData().then(function(data){
$rootScope.$broadcast('dashboard:refresh',data);
},function(error){
console.error('Refresh failed:',error);
});
},30000);
};
this.stopPolling=function(){
if(refreshInterval){
$interval.cancel(refreshInterval);
refreshInterval=null;
}
};
}]);
})();
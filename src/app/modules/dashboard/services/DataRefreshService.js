(function(){
'use strict';
angular.module('creditCardDashboard').service('DataRefreshService',['$interval',function($interval){
var refreshInterval=null;
this.startAutoRefresh=function(callback){
if(refreshInterval){
$interval.cancel(refreshInterval);
}
refreshInterval=$interval(callback,30000);
};
this.stopAutoRefresh=function(){
if(refreshInterval){
$interval.cancel(refreshInterval);
refreshInterval=null;
}
};
}]);
})();
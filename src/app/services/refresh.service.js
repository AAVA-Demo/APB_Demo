(function(){
'use strict';
angular.module('creditCardApp').service('RefreshService',['$interval',function($interval){
var self=this;
var refreshInterval=null;
self.startAutoRefresh=function(callback){
if(refreshInterval){
$interval.cancel(refreshInterval);
}
refreshInterval=$interval(function(){
callback();
},30000);
};
self.stopAutoRefresh=function(){
if(refreshInterval){
$interval.cancel(refreshInterval);
refreshInterval=null;
}
};
}]);
})();
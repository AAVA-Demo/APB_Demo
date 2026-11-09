(function(){
'use strict';
angular.module('creditCardApp').factory('DataRefreshFactory',['$interval','$rootScope',function($interval,$rootScope){
let refreshInterval=null;
return{startRefresh:function(callback,intervalMs){
if(refreshInterval){
$interval.cancel(refreshInterval);
}
refreshInterval=$interval(function(){
callback();
$rootScope.$broadcast('dataRefreshed');
},intervalMs||10000);
},stopRefresh:function(){
if(refreshInterval){
$interval.cancel(refreshInterval);
refreshInterval=null;
}}};
}]);
})();
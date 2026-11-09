(function(){
'use strict';
angular.module('creditCardApp').factory('RealtimeRefreshFactory',['$interval',function($interval){
var factory={
startPolling:startPolling,
stopPolling:stopPolling
};
var intervalPromise=null;
function startPolling(callback,intervalMs){
if(intervalPromise){stopPolling();}
intervalPromise=$interval(callback,intervalMs||60000);
return intervalPromise;
}
function stopPolling(){
if(intervalPromise){
$interval.cancel(intervalPromise);
intervalPromise=null;
}
}
return factory;
}]);
})();
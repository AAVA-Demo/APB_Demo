(function(){
'use strict';
angular.module('creditCardApp').factory('DataRefreshFactory',['$interval',function($interval){
return{
startRefresh:function(callback,intervalMs){
return $interval(callback,intervalMs);
},
stopRefresh:function(promise){
if(promise){
$interval.cancel(promise);
}
}
};
}]);
})();
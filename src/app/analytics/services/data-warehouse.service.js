(function(){
'use strict';
angular.module('analyticsModule').service('DataWarehouseService',['$http','$q',function($http,$q){
var vm=this;
vm.getHistoricalData=function(timeRange){
var deferred=$q.defer();
var params={range:timeRange||'12months'};
$http.get('/api/warehouse/transactions',{params:params}).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();
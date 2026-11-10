(function(){
'use strict';
angular.module('analyticsModule').service('KPIDataService',['$http','$q','API_CONFIG',function($http,$q,API_CONFIG){
this.getAggregatedSpend=function(userId){
var deferred=$q.defer();
$http.get(API_CONFIG.baseUrl+'/kpis/spend',{params:{userId:userId},timeout:API_CONFIG.timeout}).then(function(response){
deferred.resolve(response.data);
},function(error){
if(error.status===-1){
var mockKPIs={totalSpend:3000,monthlyAverage:1000};
deferred.resolve(mockKPIs);
}else{
deferred.reject(error);}
});
return deferred.promise;
};
}]);
})();
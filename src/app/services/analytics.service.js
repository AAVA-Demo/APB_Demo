(function(){
'use strict';
angular.module('creditCardApp').service('AnalyticsService',['$http','$q','API_CONFIG',function($http,$q,API_CONFIG){
var self=this;
self.getSpendingAnalytics=function(userId,dateRange){
var deferred=$q.defer();
$http.get(API_CONFIG.baseUrl+'/analytics/spending',{params:{userId:userId,range:dateRange}}).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
self.getMonthlyTrends=function(userId,months){
var deferred=$q.defer();
$http.get(API_CONFIG.baseUrl+'/analytics/trends',{params:{userId:userId,months:months}}).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();
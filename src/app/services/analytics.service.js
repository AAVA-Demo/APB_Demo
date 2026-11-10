(function(){
'use strict';
angular.module('creditCardApp').factory('AnalyticsService',['$http','$q',function($http,$q){
var service={};
service.getCategorySpend=function(userId,dateRange){
var deferred=$q.defer();
var params={userId:userId};
if(dateRange)params.months=dateRange;
$http.get('/api/analytics/category',{params:params}).then(function(response){
deferred.resolve(response.data.categorySpend||[]);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
service.getMonthlyTrend=function(userId,months){
var deferred=$q.defer();
$http.get('/api/analytics/trend',{params:{userId:userId,months:months||12}}).then(function(response){
deferred.resolve(response.data.monthlyTrend||[]);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
service.getCardSpend=function(userId){
var deferred=$q.defer();
$http.get('/api/analytics/card',{params:{userId:userId}}).then(function(response){
deferred.resolve(response.data.cardSpend||[]);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
return service;
}]);
})();
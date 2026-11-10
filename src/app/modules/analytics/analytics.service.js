(function(){
'use strict';
angular.module('creditCard.analytics').service('AnalyticsService',['$http','$q','API_CONFIG','$cacheFactory',function($http,$q,API_CONFIG,$cacheFactory){
var cache=$cacheFactory('analyticsCache');
this.getSpendingData=function(params){
var cacheKey='analytics_'+JSON.stringify(params);
var cached=cache.get(cacheKey);
if(cached){
return $q.resolve(cached);
}
var url=API_CONFIG.BASE_URL+API_CONFIG.ENDPOINTS.ANALYTICS;
var config={params:{userId:params.userId},timeout:API_CONFIG.TIMEOUT};
if(params.dateRange&&params.dateRange.startDate){
config.params.startDate=params.dateRange.startDate;
}
if(params.dateRange&&params.dateRange.endDate){
config.params.endDate=params.dateRange.endDate;
}
return $http.get(url,config).then(function(response){
var data=response.data;
cache.put(cacheKey,data);
return data;
},function(error){
return $q.reject(error);
});
};
}]);
})();
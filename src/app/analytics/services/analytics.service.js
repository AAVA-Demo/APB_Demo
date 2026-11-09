(function(){
'use strict';
angular.module('creditCard.analytics').factory('AnalyticsService',['$http','$q','CategorizationService','API_CONFIG',function($http,$q,CategorizationService,API_CONFIG){
const service={};
service.getSpendingAnalytics=function(userId,dateRange){
const deferred=$q.defer();
const params={userId:userId,start:dateRange.startDate,end:dateRange.endDate};
$http.get(API_CONFIG.BASE_URL+API_CONFIG.ENDPOINTS.ANALYTICS,{params:params}).then(function(response){
const analyticsData=response.data||{userId:userId,dateRange:dateRange,categorySpending:[],monthlyTrends:[],totalSpend:0};
deferred.resolve(analyticsData);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
return service;
}]);
})();
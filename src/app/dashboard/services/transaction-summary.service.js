(function(){
'use strict';
angular.module('creditCard.dashboard').factory('TransactionSummaryService',['$http','$q','API_CONFIG',function($http,$q,API_CONFIG){
const service={};
service.getCurrentMonthSpend=function(userId){
const deferred=$q.defer();
$http.get(API_CONFIG.BASE_URL+API_CONFIG.ENDPOINTS.MONTHLY_SUMMARY,{params:{userId:userId}}).then(function(response){
const monthlySpend=response.data||{totalSpend:0,cardBreakdown:[]};
deferred.resolve(monthlySpend);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
return service;
}]);
})();
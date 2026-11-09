(function(){
'use strict';
angular.module('creditCardApp').service('AnalyticsService',['$http','$q','API_ENDPOINTS',function($http,$q,API_ENDPOINTS){
var vm=this;
vm.getTransactions=function(filters){
var params={};
if(filters.startDate)params.startDate=filters.startDate;
if(filters.endDate)params.endDate=filters.endDate;
if(filters.cardIds&&filters.cardIds.length>0)params.cardIds=filters.cardIds.join(',');
if(filters.category)params.category=filters.category;
return $http.get(API_ENDPOINTS.transactions,{params:params}).then(function(response){
return response.data;
}).catch(function(error){
toastr.error('Failed to load transactions');
return $q.reject(error);
});
};
}]);
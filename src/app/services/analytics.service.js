(function(){
'use strict';
angular.module('creditCardApp').service('AnalyticsService',['ApiService','$q',function(ApiService,$q){
var self=this;
self.getCategorySpending=function(filter){
return ApiService.get('/api/analytics/category',filter).then(function(data){
return data||[];
}).catch(function(error){
console.error('Failed to fetch category spending:',error);
return $q.reject(error);});
};
self.getMonthlyTrends=function(filter){
return ApiService.get('/api/analytics/trends',filter).then(function(data){
return data||[];
}).catch(function(error){
console.error('Failed to fetch monthly trends:',error);
return $q.reject(error);});
};
}]);
})();
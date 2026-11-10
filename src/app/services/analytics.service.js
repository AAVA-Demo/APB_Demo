(function(){
'use strict';
angular.module('creditCardApp').service('AnalyticsService',['$http','$q','API_ENDPOINTS',function($http,$q,API_ENDPOINTS){
const self=this;
self.getCategorySpending=function(){
return $http.get(API_ENDPOINTS.categorySpending).then(function(response){
return response.data;
}).catch(function(error){
return $q.reject(error);
});
};
self.getMonthlyTrends=function(){
return $http.get(API_ENDPOINTS.monthlyTrends).then(function(response){
return response.data;
}).catch(function(error){
return $q.reject(error);
});
};
self.getCardWiseSpend=function(){
return $http.get(API_ENDPOINTS.cardWiseSpend).then(function(response){
return response.data;
}).catch(function(error){
return $q.reject(error);
});
};
}]);
})();
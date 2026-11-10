(function(){
'use strict';
angular.module('creditCard.dashboard').service('DashboardService',['$http','$q','API_CONFIG','$cacheFactory',function($http,$q,API_CONFIG,$cacheFactory){
var cache=$cacheFactory('dashboardCache');
this.getPortfolioData=function(userId){
var cacheKey='portfolio_'+userId;
var cached=cache.get(cacheKey);
if(cached){
return $q.resolve(cached);
}
var url=API_CONFIG.BASE_URL+API_CONFIG.ENDPOINTS.PORTFOLIO+'?userId='+userId;
return $http.get(url,{timeout:API_CONFIG.TIMEOUT}).then(function(response){
var portfolio=response.data;
cache.put(cacheKey,portfolio);
return portfolio;
},function(error){
return $q.reject(error);
});
};
}]);
})();
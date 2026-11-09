(function(){
'use strict';
angular.module('creditCard.portfolio').factory('CardDataService',['$http','$q','CacheService','API_CONFIG',function($http,$q,CacheService,API_CONFIG){
const service={};
service.getUserCards=function(userId){
const cacheKey='userCards_'+userId;
const cached=CacheService.get('cardCache',cacheKey);
if(cached)return $q.resolve(cached);
const deferred=$q.defer();
$http.get(API_CONFIG.BASE_URL+API_CONFIG.ENDPOINTS.CARDS,{params:{userId:userId}}).then(function(response){
const cards=response.data||[];
CacheService.put('cardCache',cacheKey,cards);
deferred.resolve(cards);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
return service;
}]);
})();
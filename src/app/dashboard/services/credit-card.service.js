(function(){
'use strict';
angular.module('creditCard.dashboard').factory('CreditCardService',['$http','$q','CacheService','API_CONFIG',function($http,$q,CacheService,API_CONFIG){
const service={};
service.getAllCardSummaries=function(userId){
const cacheKey='cardSummaries_'+userId;
const cached=CacheService.get('cardCache',cacheKey);
if(cached)return $q.resolve(cached);
const deferred=$q.defer();
$http.get(API_CONFIG.BASE_URL+API_CONFIG.ENDPOINTS.CARDS_SUMMARY,{params:{userId:userId}}).then(function(response){
const cardSummaries=response.data||[];
CacheService.put('cardCache',cacheKey,cardSummaries);
deferred.resolve(cardSummaries);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
return service;
}]);
})();
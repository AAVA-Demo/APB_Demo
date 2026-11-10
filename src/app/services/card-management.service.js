(function(){
'use strict';
angular.module('creditCardApp')
.service('CardManagementService',['$q','$cacheFactory','CreditCardApiService',function($q,$cacheFactory,CreditCardApiService){
var self=this;
var cache=$cacheFactory('cardCache');
var CACHE_KEY='allCards';
var CACHE_TTL=300000;
self.getAllCards=function(userId){
var deferred=$q.defer();
var cached=cache.get(CACHE_KEY);
if(cached&&(Date.now()-cached.timestamp<CACHE_TTL)){
deferred.resolve(cached.data);
return deferred.promise;
}
CreditCardApiService.getCards(userId)
.then(function(cards){
var response={cards:cards,totalCards:cards.length};
cache.put(CACHE_KEY,{data:response,timestamp:Date.now()});
deferred.resolve(response);
})
.catch(function(err){
deferred.reject(err);
});
return deferred.promise;
};
self.getCardDetails=function(cardId){
var deferred=$q.defer();
var cardKey='card_'+cardId;
var cached=cache.get(cardKey);
if(cached&&(Date.now()-cached.timestamp<CACHE_TTL)){
deferred.resolve(cached.data);
return deferred.promise;
}
CreditCardApiService.getCardById(cardId)
.then(function(card){
cache.put(cardKey,{data:card,timestamp:Date.now()});
deferred.resolve(card);
})
.catch(function(err){
deferred.reject(err);
});
return deferred.promise;
};
self.clearCache=function(){
cache.removeAll();
};
}]);
})();
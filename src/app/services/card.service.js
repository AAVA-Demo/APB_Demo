(function(){
'use strict';
angular.module('creditCardApp').service('CardService',['ApiFactory','UserProfileService','$q','$cacheFactory',function(ApiFactory,UserProfileService,$q,$cacheFactory){
const cache=$cacheFactory('cardCache');
const CACHE_TTL=300000;
this.getAllCards=function(){
const cached=cache.get('allCards');
if(cached&&(Date.now()-cached.timestamp<CACHE_TTL)){
return $q.resolve(cached.data);
}
return ApiFactory.get('/cards').then(function(response){
const cards=response.cards||[];
cache.put('allCards',{data:cards,timestamp:Date.now()});
return cards;
});
};
this.getCardDetails=function(cardId){
const cacheKey='card_'+cardId;
const cached=cache.get(cacheKey);
if(cached&&(Date.now()-cached.timestamp<CACHE_TTL)){
return $q.resolve(cached.data);
}
return UserProfileService.validateOwnership(cardId).then(function(isValid){
if(!isValid){
return $q.reject({message:'Unauthorized access to card'});
}
return ApiFactory.get('/cards/'+cardId);
}).then(function(card){
cache.put(cacheKey,{data:card,timestamp:Date.now()});
return card;
});
};
}]);
})();
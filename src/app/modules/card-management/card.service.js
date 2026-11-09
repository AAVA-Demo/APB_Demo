(function(){
'use strict';
angular.module('app.cardManagement').service('CardService',CardService);
CardService.$inject=['$http','$q','API_BASE_URL','$cacheFactory'];
function CardService($http,$q,API_BASE_URL,$cacheFactory){
var service=this;
var cache=$cacheFactory('cardCache');
service.getCards=getCards;
service.getCardDetails=getCardDetails;
function getCards(){
var cached=cache.get('cards');
if(cached){
return $q.resolve(cached);
}
return $http.get(API_BASE_URL+'/cards',{cache:true}).then(function(response){
var cards=response.data.map(function(card){
card.maskedNumber=maskCardNumber(card.cardNumber);
return card;
});
cache.put('cards',cards);
return cards;
}).catch(function(err){
return $q.reject(err);
});
}
function getCardDetails(cardId){
var cacheKey='card-'+cardId;
var cached=cache.get(cacheKey);
if(cached){
return $q.resolve(cached);
}
return $q.all({card:$http.get(API_BASE_URL+'/cards/'+cardId),spend:$http.get(API_BASE_URL+'/cards/'+cardId+'/spend')}).then(function(results){
var card=results.card.data;
card.maskedNumber=maskCardNumber(card.cardNumber);
var data={card:card,spend:results.spend.data};
cache.put(cacheKey,data);
return data;
}).catch(function(err){
return $q.reject(err);
});
}
function maskCardNumber(cardNumber){
if(!cardNumber||cardNumber.length<4)return'**** **** **** ****';
var last4=cardNumber.slice(-4);
return'**** **** **** '+last4;
}
}
})();
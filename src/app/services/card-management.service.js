(function(){
'use strict';
angular.module('cardManagementModule').service('CardManagementService',['UserProfileFactory','CardDataFactory','CardAnalyticsService','$q',function(UserProfileFactory,CardDataFactory,CardAnalyticsService,$q){
var self=this;
self.getUserCards=function(){
var deferred=$q.defer();
UserProfileFactory.getCardMapping().then(function(mapping){
var cardIds=mapping.cardIds;
CardDataFactory.getCardDetails(cardIds).then(function(cards){
var enrichedCards=cards.map(function(card){
return CardAnalyticsService.analyzeCard(card);
});
deferred.resolve(enrichedCards);
},function(error){
deferred.reject(error);
});
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
self.getCardDetail=function(cardId){
var deferred=$q.defer();
CardDataFactory.getCardDetails([cardId]).then(function(cards){
if(cards.length>0){
var enrichedCard=CardAnalyticsService.analyzeCard(cards[0]);
deferred.resolve(enrichedCard);
}else{
deferred.reject('Card not found');
}
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();
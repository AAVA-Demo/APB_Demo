(function(){
'use strict';
angular.module('cardManagement').service('cardManagementService',['$q','cardRepositoryService','cardSpendService',function($q,cardRepositoryService,cardSpendService){
var service=this;
service.getAllCards=getAllCards;
service.getCardDetail=getCardDetail;
function getAllCards(){
var deferred=$q.defer();
cardRepositoryService.fetchCards().then(function(cards){
var spendPromises=[];
angular.forEach(cards,function(card){
spendPromises.push(cardSpendService.getCardSpending(card.cardId));
});
$q.all(spendPromises).then(function(spendingData){
for(var i=0;i<cards.length;i++){
cards[i].spending=spendingData[i];
}
deferred.resolve(cards);
},function(error){
deferred.resolve(cards);
});
},function(error){
deferred.reject(error);
});
return deferred.promise;
}
function getCardDetail(cardId){
var deferred=$q.defer();
$q.all({
card:cardRepositoryService.fetchCardById(cardId),
spending:cardSpendService.getCardSpending(cardId)
}).then(function(results){
deferred.resolve(results);
},function(error){
deferred.reject(error);
});
return deferred.promise;
}
return service;
}]);
})();
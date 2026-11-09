(function(){
'use strict';
angular.module('creditCard.management').service('CardManagementService',['$q','UserProfileService','CardDataFactory','TransactionAnalyticsFactory',function($q,UserProfileService,CardDataFactory,TransactionAnalyticsFactory){
const self=this;
let cachedCards=null;
self.getAllCards=function(){
if(cachedCards){
return $q.resolve(cachedCards);
}
const deferred=$q.defer();
UserProfileService.getLinkedCardIds().then(function(cardIds){
const promises=cardIds.map(function(cardId){
return $q.all({
details:CardDataFactory.getCardDetails({cardId:cardId}).$promise,
spending:TransactionAnalyticsFactory.getCardSpending({cardId:cardId}).$promise
}).then(function(result){
const card=result.details;
const spending=result.spending;
card.monthlySpend=spending.monthlySpend||0;
card.spendingTrend=spending.spendingTrend||[];
card.topCategories=spending.topCategories||[];
card.utilization=card.creditLimit>0?((card.currentBalance/card.creditLimit)*100).toFixed(2):0;
return card;
});
});
$q.all(promises).then(function(cards){
cachedCards=cards;
deferred.resolve(cards);
},function(error){
deferred.reject(error);
});
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
self.invalidateCache=function(){
cachedCards=null;
};
}]);
})();
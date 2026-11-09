(function(){
'use strict';
angular.module('portfolioModule').service('PortfolioService',['CardDataFactory','UserProfileFactory','TransactionFactory','CardAnalyticsService','$q',function(CardDataFactory,UserProfileFactory,TransactionFactory,CardAnalyticsService,$q){
const self=this;
self.getPortfolioData=function(userId){
return UserProfileFactory.getUserCards({userId:userId}).$promise.then(function(cardIds){
const cardPromises=cardIds.map(function(cardId){
return $q.all({details:CardDataFactory.getCardDetails({cardId:cardId}).$promise,transactions:TransactionFactory.getCardTransactions({cardId:cardId}).$promise}).then(function(result){
const metrics=CardAnalyticsService.computeMetrics(result.details,result.transactions);
return angular.extend({},result.details,{metrics:metrics});
});
});
return $q.all(cardPromises);
});
};
}]);
})();
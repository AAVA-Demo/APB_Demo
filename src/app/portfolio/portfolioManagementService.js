angular.module('portfolioModule').service('portfolioManagementService',['authFactory','cardRepositoryService','aggregationService','$q',function(authFactory,cardRepositoryService,aggregationService,$q){
var service=this;
service.getPortfolio=function(){
var deferred=$q.defer();
var userContext=authFactory.getUserContext();
cardRepositoryService.getUserCards(userContext.userId).then(function(response){
var cardIds=response.cardIds;
var cardPromises=cardIds.map(function(cardId){
return cardRepositoryService.getCardDetails(cardId);
});
$q.all(cardPromises).then(function(cards){
var summary=aggregationService.calculatePortfolioSummary(cards);
deferred.resolve({cards:cards,summary:summary});
},function(error){
deferred.reject(error);
});
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
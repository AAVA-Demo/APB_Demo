angular.module('cardManagementModule').service('cardManagementService',['userProfileService','creditCardDataService','spendAnalysisService','$q',function(userProfileService,creditCardDataService,spendAnalysisService,$q){
var service=this;
service.getAllCards=function(){
var deferred=$q.defer();
userProfileService.getUserCardAssociations().then(function(response){
var cardIds=response.cardIds;
var cardPromises=cardIds.map(function(cardId){
return $q.all([
creditCardDataService.getCardDetails(cardId),
spendAnalysisService.getCardMetrics(cardId)
]).then(function(results){
var cardDetails=results[0].cardDetails;
var metrics=results[1];
return angular.extend({},cardDetails,{metrics:metrics});
});
});
$q.all(cardPromises).then(function(cards){
deferred.resolve(cards);
},function(error){
deferred.reject(error);
});
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
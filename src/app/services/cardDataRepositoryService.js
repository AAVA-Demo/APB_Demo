angular.module('creditCardApp').service('cardDataRepositoryService',['$http','$q',function($http,$q){
var service=this;
service.getCardSummary=function(){
var deferred=$q.defer();
setTimeout(function(){
deferred.resolve({totalLimit:30000.00,totalOutstanding:7500.00,cardCount:3});
},300);
return deferred.promise;
};
}]);
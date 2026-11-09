angular.module('creditCardApp').service('transactionService',['$http','$q',function($http,$q){
var service=this;
service.getMonthlySpend=function(){
var deferred=$q.defer();
setTimeout(function(){
deferred.resolve({monthlySpend:2500.00});
},300);
return deferred.promise;
};
}]);
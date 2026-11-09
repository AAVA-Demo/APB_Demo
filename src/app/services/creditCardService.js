angular.module('creditCardApp').service('creditCardService',['$http','$q',function($http,$q){
var service=this;
service.getAggregatedData=function(){
var deferred=$q.defer();
setTimeout(function(){
deferred.resolve({totalLimit:30000.00,totalBalance:7500.00});
},300);
return deferred.promise;
};
}]);
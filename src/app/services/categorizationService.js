angular.module('creditCardApp').service('categorizationService',['$http','$q',function($http,$q){
var service=this;
service.categorizeTransactions=function(transactions){
var deferred=$q.defer();
setTimeout(function(){
deferred.resolve({categorizedTransactions:transactions});
},200);
return deferred.promise;
};
service.getCategoryMappings=function(){
var deferred=$q.defer();
setTimeout(function(){
deferred.resolve({categories:['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous']});
},100);
return deferred.promise;
};
}]);
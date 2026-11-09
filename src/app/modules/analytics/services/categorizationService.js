(function(){
'use strict';
angular.module('analytics').service('categorizationService',['$http','$q',function($http,$q){
var service=this;
service.categorizeTransactions=categorizeTransactions;
function categorizeTransactions(transactions){
var categorized=[];
angular.forEach(transactions,function(txn){
if(!txn.category){
txn.category='Miscellaneous';
}
categorized.push(txn);
});
var deferred=$q.defer();
deferred.resolve(categorized);
return deferred.promise;
}
return service;
}]);
})();
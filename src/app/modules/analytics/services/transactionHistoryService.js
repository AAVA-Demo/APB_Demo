(function(){
'use strict';
angular.module('analytics').service('transactionHistoryService',['$http','$q',function($http,$q){
var service=this;
service.fetchHistory=fetchHistory;
function fetchHistory(months){
var deferred=$q.defer();
$http.get('/api/transactions/history',{params:{months:months}}).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
}
return service;
}]);
})();
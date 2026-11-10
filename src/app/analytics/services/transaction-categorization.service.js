(function(){
'use strict';
angular.module('analyticsModule').service('TransactionCategorizationService',['$http','$q',function($http,$q){
var vm=this;
vm.getCategorizedTransactions=function(timeRange,categoryFilter){
var deferred=$q.defer();
var params={range:timeRange||'12months'};
if(categoryFilter){
params.category=categoryFilter;
}
$http.get('/api/transactions/categorized',{params:params}).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();
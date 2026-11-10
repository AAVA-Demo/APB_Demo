(function(){
'use strict';
angular.module('transactionModule').service('TransactionDataService',['$http','$q',function($http,$q){
var vm=this;
vm.fetchTransactions=function(page,pageSize,query){
var deferred=$q.defer();
var params={page:page||1,size:pageSize||20};
if(query){
angular.extend(params,query);
}
$http.get('/api/transactions',{params:params}).then(function(response){
deferred.resolve({
transactions:response.data.transactions||[],
pagination:{
currentPage:response.data.currentPage||1,
pageSize:response.data.pageSize||20,
totalRecords:response.data.totalRecords||0,
totalPages:response.data.totalPages||0
}
});
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();
(function(){
'use strict';
angular.module('transactionManagement').service('TransactionManagementService',TransactionManagementService);
TransactionManagementService.$inject=['TransactionProcessingFactory','DataAggregationService','$q'];
function TransactionManagementService(TransactionProcessingFactory,DataAggregationService,$q){
var vm=this;
vm.getTransactions=getTransactions;
function getTransactions(page,pageSize){
var deferred=$q.defer();
TransactionProcessingFactory.fetchTransactions({page:page,size:pageSize}).$promise.then(function(response){
var transactions=response.data;
var totalRecords=response.totalRecords;
var trends=DataAggregationService.computeMonthlyTrends('user123');
var paginationConfig={currentPage:page,pageSize:pageSize,totalRecords:totalRecords,totalPages:Math.ceil(totalRecords/pageSize)};
deferred.resolve({transactions:transactions,trends:trends,pagination:paginationConfig});
},function(err){
deferred.reject(err);
});
return deferred.promise;
}
}
})();
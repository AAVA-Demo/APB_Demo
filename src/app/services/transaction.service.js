(function(){
'use strict';
angular.module('cardManagementModule').service('TransactionService',['TransactionDataFactory','$q',function(TransactionDataFactory,$q){
var service=this;
service.getTransactionsByCard=function(cardId){
return TransactionDataFactory.fetchTransactions(cardId);
};
}]);
})();
(function(){
'use strict';
angular.module('creditCardApp').service('CategoryService',['$http','$q','API_CONFIG',function($http,$q,API_CONFIG){
this.enrichTransactions=function(transactions){
return transactions.map(function(txn){
if(!txn.category){
txn.category='Miscellaneous';
}
return txn;
});
};
this.getCategoryMapping=function(){
return{'Food & Dining':'#FF6384',Fuel:'#36A2EB',Shopping:'#FFCE56',Travel:'#4BC0C0',Entertainment:'#9966FF',Utilities:'#FF9F40',Healthcare:'#FF6384',Education:'#C9CBCF',Miscellaneous:'#8E8E8E'};
};
}]);
})();
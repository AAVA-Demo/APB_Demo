(function(){
'use strict';
angular.module('creditCard.analytics').filter('categoryFilter',function(){
return function(transactions,category){
if(!category){
return transactions;
}
return transactions.filter(function(txn){
return txn.category===category;
});
};
});
})();
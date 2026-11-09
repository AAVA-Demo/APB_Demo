(function(){
'use strict';
angular.module('creditCardApp').filter('categoryFilter',[function(){
return function(transactions,selectedCategory){
if(!selectedCategory||selectedCategory===''){
return transactions;
}
return transactions.filter(function(txn){
return txn.category===selectedCategory;
});
};
}]);
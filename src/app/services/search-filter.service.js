(function(){
'use strict';
angular.module('creditCard.transactions').service('SearchFilterService',[function(){
this.applyFilters=function(transactions,filterCriteria){
if(!transactions||!transactions.length)return[];
let filtered=transactions.slice();
if(filterCriteria.dateRange&&filterCriteria.dateRange.startDate&&filterCriteria.dateRange.endDate){
const start=new Date(filterCriteria.dateRange.startDate);
const end=new Date(filterCriteria.dateRange.endDate);
filtered=filtered.filter(function(txn){return txn.date>=start&&txn.date<=end;});
}
if(filterCriteria.amountRange){
if(filterCriteria.amountRange.min!=null)filtered=filtered.filter(function(txn){return txn.amount>=filterCriteria.amountRange.min;});
if(filterCriteria.amountRange.max!=null)filtered=filtered.filter(function(txn){return txn.amount<=filterCriteria.amountRange.max;});
}
if(filterCriteria.categories&&filterCriteria.categories.length>0){
filtered=filtered.filter(function(txn){return filterCriteria.categories.indexOf(txn.category)!==-1;});
}
if(filterCriteria.cardIds&&filterCriteria.cardIds.length>0){
filtered=filtered.filter(function(txn){return filterCriteria.cardIds.indexOf(txn.cardId)!==-1;});
}
if(filterCriteria.searchTerm){
const term=filterCriteria.searchTerm.toLowerCase();
filtered=filtered.filter(function(txn){return txn.merchant.toLowerCase().indexOf(term)!==-1||txn.category.toLowerCase().indexOf(term)!==-1;});
}
return filtered;
};
}]);
})();
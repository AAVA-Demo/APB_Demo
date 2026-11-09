(function(){
'use strict';
angular.module('creditCardApp').service('SearchFilterService',[function(){
var self=this;
self.applyFilters=function(transactions,criteria){
var filtered=transactions;
if(criteria.startDate){
var startDate=new Date(criteria.startDate);
filtered=filtered.filter(function(t){return new Date(t.transactionDate)>=startDate;});
}
if(criteria.endDate){
var endDate=new Date(criteria.endDate);
filtered=filtered.filter(function(t){return new Date(t.transactionDate)<=endDate;});
}
if(criteria.merchantName){
var merchant=criteria.merchantName.toLowerCase();
filtered=filtered.filter(function(t){return t.merchantName.toLowerCase().indexOf(merchant)!==-1;});
}
if(criteria.category){
filtered=filtered.filter(function(t){return t.category===criteria.category;});
}
if(criteria.minAmount){
filtered=filtered.filter(function(t){return t.amount>=criteria.minAmount;});
}
if(criteria.maxAmount){
filtered=filtered.filter(function(t){return t.amount<=criteria.maxAmount;});
}
if(criteria.cardId){
filtered=filtered.filter(function(t){return t.cardId===criteria.cardId;});
}
return filtered;
};
}]);
})();
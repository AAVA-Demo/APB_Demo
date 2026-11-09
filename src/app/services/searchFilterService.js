(function(){
'use strict';
angular.module('creditCardApp').service('searchFilterService',['$filter',function($filter){
this.applyFilter=function(transactions,filter){
if(!transactions||!transactions.length)return[];
var filtered=transactions;
if(filter.dateFrom){
filtered=$filter('filter')(filtered,function(t){
return new Date(t.transactionDate)>=new Date(filter.dateFrom);
});
}
if(filter.dateTo){
filtered=$filter('filter')(filtered,function(t){
return new Date(t.transactionDate)<=new Date(filter.dateTo);
});
}
if(filter.cardId){
filtered=$filter('filter')(filtered,{cardId:filter.cardId});
}
if(filter.minAmount){
filtered=$filter('filter')(filtered,function(t){
return t.amount>=filter.minAmount;
});
}
if(filter.maxAmount){
filtered=$filter('filter')(filtered,function(t){
return t.amount<=filter.maxAmount;
});
}
if(filter.merchant){
filtered=$filter('filter')(filtered,{merchant:filter.merchant});
}
if(filter.category){
filtered=$filter('filter')(filtered,{category:filter.category});
}
return filtered;
};
}]);
})();
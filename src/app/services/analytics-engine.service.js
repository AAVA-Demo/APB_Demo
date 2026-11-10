(function(){
'use strict';
angular.module('creditCardApp').service('AnalyticsEngineService',['CategoryFactory',function(CategoryFactory){
var vm=this;
vm.aggregateByCategory=function(transactions){
var categoryMap={};
var categories=CategoryFactory.getCategories();
angular.forEach(categories,function(cat){
categoryMap[cat]={categoryName:cat,totalAmount:0,transactionCount:0,percentage:0,transactions:[]};
});
var totalSpending=0;
angular.forEach(transactions,function(txn){
if(categoryMap[txn.category]){
categoryMap[txn.category].totalAmount+=txn.amount;
categoryMap[txn.category].transactionCount++;
categoryMap[txn.category].transactions.push(txn);
totalSpending+=txn.amount;
}
});
angular.forEach(categoryMap,function(catData){
if(totalSpending>0){
catData.percentage=(catData.totalAmount/totalSpending)*100;
}
});
var result=[];
angular.forEach(categoryMap,function(val){
result.push(val);
});
return result;
};
}]);
})();
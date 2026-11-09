(function(){
'use strict';
angular.module('creditCardApp').service('DataAggregationService',[function(){
var vm=this;
vm.aggregateByCategory=function(transactions){
var categoryMap={};
var totalSpend=0;
transactions.forEach(function(txn){
var cat=txn.category||'Miscellaneous';
var amt=parseFloat(txn.amount)||0;
if(!categoryMap[cat]){
categoryMap[cat]={category:cat,totalAmount:0,transactionCount:0};
}
categoryMap[cat].totalAmount+=amt;
categoryMap[cat].transactionCount++;
totalSpend+=amt;
});
var categoryArray=Object.keys(categoryMap).map(function(key){
var item=categoryMap[key];
item.totalAmount=parseFloat(item.totalAmount.toFixed(2));
item.percentage=totalSpend>0?parseFloat(((item.totalAmount/totalSpend)*100).toFixed(2)):0;
return item;
});
return categoryArray.sort(function(a,b){return b.totalAmount-a.totalAmount;});
};
vm.aggregateByMonth=function(transactions){
var monthMap={};
transactions.forEach(function(txn){
var date=new Date(txn.transactionDate);
var monthKey=date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0');
if(!monthMap[monthKey]){
monthMap[monthKey]={month:monthKey,totalSpend:0,transactions:[]};
}
monthMap[monthKey].totalSpend+=parseFloat(txn.amount)||0;
monthMap[monthKey].transactions.push(txn);
});
var monthArray=Object.keys(monthMap).map(function(key){
var item=monthMap[key];
item.totalSpend=parseFloat(item.totalSpend.toFixed(2));
item.categoryBreakdown=vm.aggregateByCategory(item.transactions);
delete item.transactions;
return item;
});
return monthArray.sort(function(a,b){return a.month.localeCompare(b.month);});
};
}]);
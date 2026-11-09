(function(){
'use strict';
angular.module('creditCardApp').service('dataAggregationService',[function(){
const self=this;
self.aggregateByCategory=function(transactions){
const categoryMap={};
transactions.forEach(t=>{
if(!categoryMap[t.category]){
categoryMap[t.category]={category:t.category,totalAmount:0,transactionCount:0,percentage:0};
}
categoryMap[t.category].totalAmount+=t.amount;
categoryMap[t.category].transactionCount++;
});
const total=Object.values(categoryMap).reduce((sum,c)=>sum+c.totalAmount,0);
Object.values(categoryMap).forEach(c=>{
c.percentage=total>0?(c.totalAmount/total)*100:0;
});
return Object.values(categoryMap).sort((a,b)=>b.totalAmount-a.totalAmount);
};
self.aggregateMonthlyTrends=function(transactions){
const monthMap={};
transactions.forEach(t=>{
const d=new Date(t.date);
const monthKey=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
if(!monthMap[monthKey]){
monthMap[monthKey]={month:monthKey,totalSpend:0,categoryBreakdown:{}};
}
monthMap[monthKey].totalSpend+=t.amount;
if(!monthMap[monthKey].categoryBreakdown[t.category]){
monthMap[monthKey].categoryBreakdown[t.category]={category:t.category,totalAmount:0,transactionCount:0,percentage:0};
}
monthMap[monthKey].categoryBreakdown[t.category].totalAmount+=t.amount;
monthMap[monthKey].categoryBreakdown[t.category].transactionCount++;
});
const result=Object.values(monthMap).map(m=>{
m.categoryBreakdown=Object.values(m.categoryBreakdown);
return m;
}).sort((a,b)=>a.month.localeCompare(b.month));
return result;
};
}]);
})();
(function(){
'use strict';
angular.module('creditCardApp')
.service('TrendCalculationService',[function(){
this.calculateTrends=function(transactions){
if(!transactions||!transactions.length){
return{monthlyTrends:[],cardWiseSpend:[],dateRange:{startDate:null,endDate:null}};
}
var monthlyMap=new Map();
var cardMap=new Map();
var minDate=new Date(Math.min.apply(null,transactions.map(function(t){return new Date(t.date);})));
var maxDate=new Date(Math.max.apply(null,transactions.map(function(t){return new Date(t.date);})));
transactions.forEach(function(t){
var monthKey=new Date(t.date).toISOString().substring(0,7);
if(!monthlyMap.has(monthKey)){
monthlyMap.set(monthKey,{month:monthKey,totalSpend:0,cardBreakdown:[]});
}
var monthData=monthlyMap.get(monthKey);
monthData.totalSpend+=t.amount;
if(!cardMap.has(t.cardId)){
cardMap.set(t.cardId,{cardId:t.cardId,cardName:t.cardName,totalSpend:0});
}
cardMap.get(t.cardId).totalSpend+=t.amount;
});
var monthlyTrends=Array.from(monthlyMap.values()).sort(function(a,b){return a.month.localeCompare(b.month);});
var cardWiseSpend=Array.from(cardMap.values());
var totalSpend=cardWiseSpend.reduce(function(sum,c){return sum+c.totalSpend;},0);
cardWiseSpend.forEach(function(c){
c.percentage=totalSpend>0?Number(((c.totalSpend/totalSpend)*100).toFixed(2)):0;
c.totalSpend=Number(c.totalSpend.toFixed(2));
});
return{monthlyTrends:monthlyTrends,cardWiseSpend:cardWiseSpend,dateRange:{startDate:minDate,endDate:maxDate}};
};
}]);
})();
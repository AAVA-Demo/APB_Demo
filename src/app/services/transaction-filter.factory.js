(function(){
'use strict';
angular.module('creditCardApp').factory('TransactionFilterFactory',[function(){
return{
buildFilterParams:function(filterObj){
var params={};
if(filterObj.cardId)params.cardId=filterObj.cardId;
if(filterObj.startDate)params.startDate=filterObj.startDate;
if(filterObj.endDate)params.endDate=filterObj.endDate;
if(filterObj.minAmount)params.minAmount=filterObj.minAmount;
if(filterObj.maxAmount)params.maxAmount=filterObj.maxAmount;
return params;
},
applyClientFilter:function(transactions,filterObj){
if(!filterObj)return transactions;
var filtered=transactions;
if(filterObj.cardId){
filtered=filtered.filter(function(t){return t.cardId===filterObj.cardId;});
}
if(filterObj.startDate){
var start=new Date(filterObj.startDate);
filtered=filtered.filter(function(t){return new Date(t.timestamp)>=start;});
}
if(filterObj.endDate){
var end=new Date(filterObj.endDate);
filtered=filtered.filter(function(t){return new Date(t.timestamp)<=end;});
}
if(filterObj.minAmount){
filtered=filtered.filter(function(t){return t.amount>=filterObj.minAmount;});
}
if(filterObj.maxAmount){
filtered=filtered.filter(function(t){return t.amount<=filterObj.maxAmount;});
}
return filtered;
}
};
}]);
})();
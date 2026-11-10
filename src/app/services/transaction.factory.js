(function(){
'use strict';
angular.module('creditCardApp').factory('TransactionFactory',['$http','$q',function($http,$q){
var API_BASE='/api';
var mockTransactions=[
{transactionId:'T001',cardId:'C001',amount:2500.50,category:'Food & Dining',transactionDate:new Date('2024-01-15'),description:'Restaurant'},
{transactionId:'T002',cardId:'C001',amount:5000.00,category:'Shopping',transactionDate:new Date('2024-01-20'),description:'Electronics'},
{transactionId:'T003',cardId:'C001',amount:1200.75,category:'Fuel',transactionDate:new Date('2024-02-05'),description:'Gas Station'},
{transactionId:'T004',cardId:'C002',amount:8000.00,category:'Travel',transactionDate:new Date('2024-01-10'),description:'Flight Booking'},
{transactionId:'T005',cardId:'C002',amount:1500.00,category:'Entertainment',transactionDate:new Date('2024-02-12'),description:'Concert'},
{transactionId:'T006',cardId:'C003',amount:3000.00,category:'Utilities',transactionDate:new Date('2024-01-25'),description:'Electricity'},
{transactionId:'T007',cardId:'C003',amount:4500.00,category:'Healthcare',transactionDate:new Date('2024-02-18'),description:'Medical'},
{transactionId:'T008',cardId:'C001',amount:2000.00,category:'Education',transactionDate:new Date('2024-01-30'),description:'Course Fee'},
{transactionId:'T009',cardId:'C002',amount:750.00,category:'Miscellaneous',transactionDate:new Date('2024-02-20'),description:'Other'},
{transactionId:'T010',cardId:'C001',amount:3200.00,category:'Food & Dining',transactionDate:new Date('2024-02-28'),description:'Groceries'}
];
function calculateMonthlySpend(){
var currentMonth=new Date().getMonth();
var currentYear=new Date().getFullYear();
var total=0;
mockTransactions.forEach(function(t){
var txnDate=new Date(t.transactionDate);
if(txnDate.getMonth()===currentMonth&&txnDate.getFullYear()===currentYear){
total+=t.amount;
}
});
return total;
}
return{
getMonthlyTransactions:function(){
var deferred=$q.defer();
var monthlySpend=calculateMonthlySpend();
setTimeout(function(){deferred.resolve({data:{monthlySpend:monthlySpend}});},200);
return deferred.promise;
},
getCardMetrics:function(cardId){
var deferred=$q.defer();
var cardTxns=mockTransactions.filter(function(t){return t.cardId===cardId;});
var totalSpend=cardTxns.reduce(function(sum,t){return sum+t.amount;},0);
var metrics={cardId:cardId,monthlySpend:totalSpend,totalTransactions:cardTxns.length,averageTransactionAmount:cardTxns.length>0?totalSpend/cardTxns.length:0,lastTransactionDate:cardTxns.length>0?cardTxns[cardTxns.length-1].transactionDate:null};
setTimeout(function(){deferred.resolve({data:metrics});},200);
return deferred.promise;
},
getCardTransactions:function(cardId){
var deferred=$q.defer();
var cardTxns=mockTransactions.filter(function(t){return t.cardId===cardId;});
setTimeout(function(){deferred.resolve({data:cardTxns});},200);
return deferred.promise;
},
fetchTransactions:function(startDate,endDate){
var deferred=$q.defer();
var start=new Date(startDate);
var end=new Date(endDate);
var filtered=mockTransactions.filter(function(t){
var txnDate=new Date(t.transactionDate);
return txnDate>=start&&txnDate<=end;
});
setTimeout(function(){deferred.resolve({data:filtered});},300);
return deferred.promise;
}
};
}]);
})();
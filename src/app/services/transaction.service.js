(function(){
'use strict';
angular.module('creditCardApp').factory('TransactionService',['$http','$q',function($http,$q){
var API_BASE='/api/transactions';
var service={
getMonthlyTransactions:getMonthlyTransactions,
fetchTransactions:fetchTransactions,
getCardSpending:getCardSpending
};
return service;
function getMonthlyTransactions(userId){
return $http.get(API_BASE+'/current-month?userId='+userId).then(function(response){
return response.data||getMockMonthlyTransactions();
},function(error){
return getMockMonthlyTransactions();
});
}
function fetchTransactions(userId,dateRange){
var params='?userId='+userId;
if(dateRange&&dateRange.from)params+='&from='+dateRange.from;
if(dateRange&&dateRange.to)params+='&to='+dateRange.to;
if(dateRange&&dateRange.months)params+='&months='+dateRange.months;
return $http.get(API_BASE+params).then(function(response){
return response.data||getMockTransactions();
},function(error){
return getMockTransactions();
});
}
function getCardSpending(cardId){
return $http.get(API_BASE+'/card/'+cardId).then(function(response){
return response.data||getMockCardSpending(cardId);
},function(error){
return getMockCardSpending(cardId);
});
}
function getMockMonthlyTransactions(){
return[
{transactionId:'t1',cardId:'card1',amount:2500,category:'Food & Dining',transactionDate:new Date('2024-01-15'),merchantName:'Restaurant A'},
{transactionId:'t2',cardId:'card1',amount:3000,category:'Fuel',transactionDate:new Date('2024-01-18'),merchantName:'Gas Station B'},
{transactionId:'t3',cardId:'card2',amount:5000,category:'Shopping',transactionDate:new Date('2024-01-20'),merchantName:'Mall C'},
{transactionId:'t4',cardId:'card1',amount:1500,category:'Entertainment',transactionDate:new Date('2024-01-22'),merchantName:'Cinema D'}
];
}
function getMockTransactions(){
var categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
var transactions=[];
for(var i=0;i<12;i++){
for(var j=0;j<10;j++){
var month=new Date();
month.setMonth(month.getMonth()-i);
transactions.push({
transactionId:'t_'+i+'_'+j,
cardId:'card'+(j%3+1),
amount:Math.floor(Math.random()*5000)+500,
category:categories[j%9],
transactionDate:new Date(month.getFullYear(),month.getMonth(),Math.floor(Math.random()*28)+1),
merchantName:'Merchant '+j
});
}
}
return transactions;
}
function getMockCardSpending(cardId){
return{
cardId:cardId,
monthlySpend:12000,
transactions:[
{transactionId:'t1',amount:2500,category:'Food & Dining',date:new Date()},
{transactionId:'t2',amount:3000,category:'Fuel',date:new Date()}
]
};
}
}]);
})();
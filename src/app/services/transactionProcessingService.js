angular.module('creditCardApp').service('transactionProcessingService',['$http','$q',function($http,$q){
var service=this;
var mockTransactions=[
{transactionId:'t1',cardId:'card1',amount:150.50,date:new Date('2024-01-15'),category:'Food & Dining',merchantName:'Restaurant A'},
{transactionId:'t2',cardId:'card1',amount:60.00,date:new Date('2024-01-18'),category:'Fuel',merchantName:'Gas Station B'},
{transactionId:'t3',cardId:'card2',amount:200.00,date:new Date('2024-01-20'),category:'Shopping',merchantName:'Store C'},
{transactionId:'t4',cardId:'card2',amount:500.00,date:new Date('2024-01-22'),category:'Travel',merchantName:'Airline D'},
{transactionId:'t5',cardId:'card3',amount:80.00,date:new Date('2024-01-25'),category:'Entertainment',merchantName:'Cinema E'}
];
service.getMonthlyTransactions=function(){
var deferred=$q.defer();
setTimeout(function(){
var currentMonth=new Date().getMonth();
var filtered=mockTransactions.filter(function(t){
return new Date(t.date).getMonth()===currentMonth;
});
var total=filtered.reduce(function(sum,t){return sum+t.amount;},0);
deferred.resolve({transactions:filtered,total:total.toFixed(2)});
},400);
return deferred.promise;
};
service.getTransactions=function(dateRange){
var deferred=$q.defer();
setTimeout(function(){
deferred.resolve({transactions:mockTransactions});
},400);
return deferred.promise;
};
}]);
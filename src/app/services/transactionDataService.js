angular.module('creditCardApp').service('transactionDataService',['$http','$q',function($http,$q){
var service=this;
var mockTransactions=[
{transactionId:'t1',cardId:'card1',amount:150.50,date:new Date('2023-12-15'),category:'Food & Dining',merchantName:'Restaurant A',description:'Dinner'},
{transactionId:'t2',cardId:'card1',amount:60.00,date:new Date('2023-12-18'),category:'Fuel',merchantName:'Gas Station B',description:'Fuel'},
{transactionId:'t3',cardId:'card2',amount:200.00,date:new Date('2024-01-05'),category:'Shopping',merchantName:'Store C',description:'Clothes'},
{transactionId:'t4',cardId:'card2',amount:500.00,date:new Date('2024-01-10'),category:'Travel',merchantName:'Airline D',description:'Flight'},
{transactionId:'t5',cardId:'card3',amount:80.00,date:new Date('2024-01-15'),category:'Entertainment',merchantName:'Cinema E',description:'Movie'},
{transactionId:'t6',cardId:'card1',amount:120.00,date:new Date('2024-01-20'),category:'Utilities',merchantName:'Electric Co',description:'Bill'},
{transactionId:'t7',cardId:'card2',amount:300.00,date:new Date('2024-01-22'),category:'Healthcare',merchantName:'Hospital F',description:'Checkup'},
{transactionId:'t8',cardId:'card3',amount:250.00,date:new Date('2024-01-25'),category:'Education',merchantName:'School G',description:'Tuition'},
{transactionId:'t9',cardId:'card1',amount:50.00,date:new Date('2024-01-28'),category:'Miscellaneous',merchantName:'Misc Store',description:'Other'}
];
service.getTransactions=function(dateRange){
var deferred=$q.defer();
setTimeout(function(){
deferred.resolve({transactions:mockTransactions});
},400);
return deferred.promise;
};
}]);
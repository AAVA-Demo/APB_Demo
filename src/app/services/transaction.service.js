(function(){
'use strict';
angular.module('creditCardApp').service('TransactionService',['$http','$q',function($http,$q){
var self=this;
var API_BASE='/api/transactions';
self.getTransactions=function(params){
params=params||{};
var page=params.page||1;
var pageSize=params.pageSize||20;
var queryParams='?page='+page+'&pageSize='+pageSize;
if(params.cardId)queryParams+='&cardId='+params.cardId;
if(params.startDate)queryParams+='&startDate='+params.startDate;
if(params.endDate)queryParams+='&endDate='+params.endDate;
return $http.get(API_BASE+queryParams).then(function(response){
return response.data;
},function(error){
return self._getMockTransactions(params);
});
};
self._getMockTransactions=function(params){
var allTxns=[
{transactionId:'TXN001',cardId:'CC001',cardNumber:'**** 1234',timestamp:new Date('2024-01-15T10:30:00'),amount:1250.50,merchantName:'Whole Foods Market',merchantCategory:'Food & Dining',transactionType:'Purchase',status:'Completed'},
{transactionId:'TXN002',cardId:'CC001',cardNumber:'**** 1234',timestamp:new Date('2024-01-14T14:20:00'),amount:45.00,merchantName:'Shell Gas Station',merchantCategory:'Fuel',transactionType:'Purchase',status:'Completed'},
{transactionId:'TXN003',cardId:'CC002',cardNumber:'**** 5678',timestamp:new Date('2024-01-13T09:15:00'),amount:2300.00,merchantName:'Amazon',merchantCategory:'Shopping',transactionType:'Purchase',status:'Completed'},
{transactionId:'TXN004',cardId:'CC002',cardNumber:'**** 5678',timestamp:new Date('2024-01-12T16:45:00'),amount:850.00,merchantName:'Delta Airlines',merchantCategory:'Travel',transactionType:'Purchase',status:'Completed'},
{transactionId:'TXN005',cardId:'CC003',cardNumber:'**** 9012',timestamp:new Date('2024-01-11T19:30:00'),amount:125.00,merchantName:'AMC Theatres',merchantCategory:'Entertainment',transactionType:'Purchase',status:'Completed'},
{transactionId:'TXN006',cardId:'CC003',cardNumber:'**** 9012',timestamp:new Date('2024-01-10T08:00:00'),amount:180.00,merchantName:'Electric Company',merchantCategory:'Utilities',transactionType:'Purchase',status:'Completed'},
{transactionId:'TXN007',cardId:'CC001',cardNumber:'**** 1234',timestamp:new Date('2024-01-09T11:20:00'),amount:450.00,merchantName:'City Hospital',merchantCategory:'Healthcare',transactionType:'Purchase',status:'Completed'},
{transactionId:'TXN008',cardId:'CC002',cardNumber:'**** 5678',timestamp:new Date('2024-01-08T13:40:00'),amount:1200.00,merchantName:'University Bookstore',merchantCategory:'Education',transactionType:'Purchase',status:'Completed'},
{transactionId:'TXN009',cardId:'CC003',cardNumber:'**** 9012',timestamp:new Date('2024-01-07T15:10:00'),amount:75.00,merchantName:'Coffee Shop',merchantCategory:'Miscellaneous',transactionType:'Purchase',status:'Completed'},
{transactionId:'TXN010',cardId:'CC001',cardNumber:'**** 1234',timestamp:new Date('2024-01-06T17:25:00'),amount:320.00,merchantName:'Target',merchantCategory:'Shopping',transactionType:'Purchase',status:'Completed'}
];
var filtered=allTxns;
if(params.cardId){
filtered=filtered.filter(function(t){return t.cardId===params.cardId;});
}
var page=params.page||1;
var pageSize=params.pageSize||20;
var start=(page-1)*pageSize;
var end=start+pageSize;
var paginated=filtered.slice(start,end);
return{transactions:paginated,total:filtered.length,page:page,pageSize:pageSize};
};
}]);
})();
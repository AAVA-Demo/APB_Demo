(function(){
'use strict';
angular.module('creditCardApp').factory('TransactionFactory',['$http','$q','$cacheFactory',function($http,$q,$cacheFactory){
const factory={};
const cache=$cacheFactory('transactionCache');
const mockTransactions={
'card-001':[
{id:'txn-001',cardId:'card-001',amount:1200,date:new Date('2024-01-15'),merchant:'Amazon',category:'Shopping',status:'Posted'},
{id:'txn-002',cardId:'card-001',amount:850,date:new Date('2024-01-14'),merchant:'Swiggy',category:'Food & Dining',status:'Posted'},
{id:'txn-003',cardId:'card-001',amount:3500,date:new Date('2024-01-12'),merchant:'HP Petrol',category:'Fuel',status:'Posted'},
{id:'txn-004',cardId:'card-001',amount:2200,date:new Date('2024-01-10'),merchant:'Flipkart',category:'Shopping',status:'Posted'},
{id:'txn-005',cardId:'card-001',amount:650,date:new Date('2024-01-08'),merchant:'PVR Cinemas',category:'Entertainment',status:'Posted'}
],
'card-002':[
{id:'txn-006',cardId:'card-002',amount:450,date:new Date('2024-01-16'),merchant:'Starbucks',category:'Food & Dining',status:'Posted'},
{id:'txn-007',cardId:'card-002',amount:1500,date:new Date('2024-01-13'),merchant:'Reliance Digital',category:'Shopping',status:'Posted'}
],
'card-003':[
{id:'txn-008',cardId:'card-003',amount:5000,date:new Date('2024-01-11'),merchant:'MakeMyTrip',category:'Travel',status:'Posted'}
]
};
factory.getTransactions=function(cardId,page,size){
page=page||1;
size=size||50;
const cacheKey=cardId+'_'+page+'_'+size;
const cached=cache.get(cacheKey);
if(cached){
return $q.resolve(cached);
}
const allTxns=mockTransactions[cardId]||[];
const start=(page-1)*size;
const end=start+size;
const paginated=allTxns.slice(start,end);
cache.put(cacheKey,paginated);
return $q.resolve(paginated);
};
return factory;
}]);
})();
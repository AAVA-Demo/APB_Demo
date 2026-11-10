(function(){
'use strict';
angular.module('creditCardApp')
.factory('TransactionRepositoryFactory',['$http','$q','$cacheFactory',function($http,$q,$cacheFactory){
var cache=$cacheFactory('transactionRepoCache');
var mockTransactions=[
{transactionId:'T001',cardId:'CC001',amount:1250,date:new Date('2024-01-15'),merchant:'Restaurant ABC',category:'Food & Dining',description:'Dinner'},
{transactionId:'T002',cardId:'CC001',amount:3200,date:new Date('2024-01-20'),merchant:'Mall XYZ',category:'Shopping',description:'Clothing'},
{transactionId:'T003',cardId:'CC002',amount:850,date:new Date('2024-01-22'),merchant:'Gas Station',category:'Fuel',description:'Petrol'},
{transactionId:'T004',cardId:'CC003',amount:15000,date:new Date('2024-02-05'),merchant:'Airlines',category:'Travel',description:'Flight tickets'},
{transactionId:'T005',cardId:'CC001',amount:2500,date:new Date('2024-02-10'),merchant:'Cinema',category:'Entertainment',description:'Movie tickets'},
{transactionId:'T006',cardId:'CC002',amount:1800,date:new Date('2024-02-15'),merchant:'Electric Co',category:'Utilities',description:'Electricity bill'},
{transactionId:'T007',cardId:'CC003',amount:4500,date:new Date('2024-03-01'),merchant:'Hospital',category:'Healthcare',description:'Medical checkup'},
{transactionId:'T008',cardId:'CC001',amount:6200,date:new Date('2024-03-10'),merchant:'University',category:'Education',description:'Tuition fee'},
{transactionId:'T009',cardId:'CC002',amount:950,date:new Date('2024-03-15'),merchant:'Store',category:'Miscellaneous',description:'General items'},
{transactionId:'T010',cardId:'CC001',amount:2100,date:new Date('2024-04-05'),merchant:'Restaurant DEF',category:'Food & Dining',description:'Lunch'},
{transactionId:'T011',cardId:'CC003',amount:8500,date:new Date('2024-04-12'),merchant:'Electronics Store',category:'Shopping',description:'Laptop'},
{transactionId:'T012',cardId:'CC002',amount:750,date:new Date('2024-04-20'),merchant:'Gas Station',category:'Fuel',description:'Diesel'},
{transactionId:'T013',cardId:'CC001',amount:12000,date:new Date('2024-05-08'),merchant:'Hotel',category:'Travel',description:'Hotel booking'},
{transactionId:'T014',cardId:'CC003',amount:3200,date:new Date('2024-05-15'),merchant:'Concert',category:'Entertainment',description:'Concert tickets'},
{transactionId:'T015',cardId:'CC002',amount:1650,date:new Date('2024-05-22'),merchant:'Water Bill',category:'Utilities',description:'Water bill'}
];
return{
fetchTransactions:function(){
var cacheKey='allTransactions';
var cached=cache.get(cacheKey);
if(cached){
return $q.resolve(cached);
}
var data=angular.copy(mockTransactions);
cache.put(cacheKey,data);
return $q.resolve(data);
}
};
}]);
})();
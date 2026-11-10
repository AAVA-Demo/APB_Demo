(function(){
'use strict';
angular.module('creditCardApp')
.factory('TransactionDataFactory',['$http','$q','$cacheFactory',function($http,$q,$cacheFactory){
var cache=$cacheFactory('transactionCache');
var mockTransactions=[
{transactionId:'T001',cardId:'CC001',cardName:'Platinum Rewards',amount:1250,date:new Date('2024-01-15'),category:'Food & Dining',merchant:'Restaurant ABC'},
{transactionId:'T002',cardId:'CC001',cardName:'Platinum Rewards',amount:3200,date:new Date('2024-01-20'),category:'Shopping',merchant:'Mall XYZ'},
{transactionId:'T003',cardId:'CC002',cardName:'Gold Cashback',amount:850,date:new Date('2024-01-22'),category:'Fuel',merchant:'Gas Station'},
{transactionId:'T004',cardId:'CC003',cardName:'Travel Elite',amount:15000,date:new Date('2024-02-05'),category:'Travel',merchant:'Airlines'},
{transactionId:'T005',cardId:'CC001',cardName:'Platinum Rewards',amount:2500,date:new Date('2024-02-10'),category:'Entertainment',merchant:'Cinema'},
{transactionId:'T006',cardId:'CC002',cardName:'Gold Cashback',amount:1800,date:new Date('2024-02-15'),category:'Utilities',merchant:'Electric Co'},
{transactionId:'T007',cardId:'CC003',cardName:'Travel Elite',amount:4500,date:new Date('2024-03-01'),category:'Healthcare',merchant:'Hospital'},
{transactionId:'T008',cardId:'CC001',cardName:'Platinum Rewards',amount:6200,date:new Date('2024-03-10'),category:'Education',merchant:'University'},
{transactionId:'T009',cardId:'CC002',cardName:'Gold Cashback',amount:950,date:new Date('2024-03-15'),category:'Miscellaneous',merchant:'Store'},
{transactionId:'T010',cardId:'CC001',cardName:'Platinum Rewards',amount:2100,date:new Date('2024-04-05'),category:'Food & Dining',merchant:'Restaurant DEF'},
{transactionId:'T011',cardId:'CC003',cardName:'Travel Elite',amount:8500,date:new Date('2024-04-12'),category:'Shopping',merchant:'Electronics Store'},
{transactionId:'T012',cardId:'CC002',cardName:'Gold Cashback',amount:750,date:new Date('2024-04-20'),category:'Fuel',merchant:'Gas Station'},
{transactionId:'T013',cardId:'CC001',cardName:'Platinum Rewards',amount:12000,date:new Date('2024-05-08'),category:'Travel',merchant:'Hotel'},
{transactionId:'T014',cardId:'CC003',cardName:'Travel Elite',amount:3200,date:new Date('2024-05-15'),category:'Entertainment',merchant:'Concert'},
{transactionId:'T015',cardId:'CC002',cardName:'Gold Cashback',amount:1650,date:new Date('2024-05-22'),category:'Utilities',merchant:'Water Bill'}
];
return{
fetchTransactions:function(filters){
var cacheKey=JSON.stringify(filters||{});
var cached=cache.get(cacheKey);
if(cached){
return $q.resolve(cached);
}
var filtered=angular.copy(mockTransactions);
if(filters){
if(filters.startDate){
filtered=filtered.filter(function(t){return new Date(t.date)>=new Date(filters.startDate);});
}
if(filters.endDate){
filtered=filtered.filter(function(t){return new Date(t.date)<=new Date(filters.endDate);});
}
if(filters.cardId){
filtered=filtered.filter(function(t){return t.cardId===filters.cardId;});
}
}
cache.put(cacheKey,filtered);
return $q.resolve(filtered);
}
};
}]);
})();
(function(){
'use strict';
angular.module('creditCardApp').factory('transactionDataFactory',['$http','$q',function($http,$q){
const BASE_URL='/api/transactions';
const mockTransactions=[{id:'t1',cardId:'1',amount:1200,category:'Food & Dining',date:new Date('2026-11-05'),description:'Restaurant',merchantName:'Olive Garden'},{id:'t2',cardId:'1',amount:3000,category:'Fuel',date:new Date('2026-11-08'),description:'Gas Station',merchantName:'Shell'},{id:'t3',cardId:'1',amount:5000,category:'Shopping',date:new Date('2026-11-10'),description:'Electronics',merchantName:'Best Buy'},{id:'t4',cardId:'2',amount:2500,category:'Travel',date:new Date('2026-11-12'),description:'Flight Booking',merchantName:'Delta Airlines'},{id:'t5',cardId:'2',amount:800,category:'Entertainment',date:new Date('2026-11-15'),description:'Movie Tickets',merchantName:'AMC Theatres'},{id:'t6',cardId:'3',amount:1500,category:'Utilities',date:new Date('2026-11-18'),description:'Electric Bill',merchantName:'City Power'},{id:'t7',cardId:'1',amount:2000,category:'Healthcare',date:new Date('2026-11-20'),description:'Medical Checkup',merchantName:'Health Clinic'},{id:'t8',cardId:'2',amount:1800,category:'Education',date:new Date('2026-11-22'),description:'Online Course',merchantName:'Coursera'},{id:'t9',cardId:'3',amount:900,category:'Miscellaneous',date:new Date('2026-11-25'),description:'Subscription',merchantName:'Netflix'},{id:'t10',cardId:'1',amount:1100,category:'Food & Dining',date:new Date('2026-10-15'),description:'Grocery',merchantName:'Walmart'},{id:'t11',cardId:'2',amount:2200,category:'Fuel',date:new Date('2026-10-20'),description:'Gas Station',merchantName:'BP'},{id:'t12',cardId:'3',amount:3500,category:'Shopping',date:new Date('2026-10-25'),description:'Clothing',merchantName:'Macys'},{id:'t13',cardId:'1',amount:4000,category:'Travel',date:new Date('2026-09-10'),description:'Hotel Booking',merchantName:'Marriott'},{id:'t14',cardId:'2',amount:600,category:'Entertainment',date:new Date('2026-09-18'),description:'Concert',merchantName:'Live Nation'},{id:'t15',cardId:'3',amount:1300,category:'Utilities',date:new Date('2026-09-22'),description:'Internet Bill',merchantName:'Comcast'}];
return{
fetchTransactions:function(){
const deferred=$q.defer();
setTimeout(()=>deferred.resolve(mockTransactions),300);
return deferred.promise;
},
fetchMonthlyTransactions:function(){
const deferred=$q.defer();
const now=new Date();
const currentMonth=now.getMonth();
const currentYear=now.getFullYear();
const filtered=mockTransactions.filter(t=>{
const tDate=new Date(t.date);
return tDate.getMonth()===currentMonth&&tDate.getFullYear()===currentYear;
});
setTimeout(()=>deferred.resolve(filtered),300);
return deferred.promise;
},
fetchCardWiseSpending:function(){
const deferred=$q.defer();
const now=new Date();
const currentMonth=now.getMonth();
const currentYear=now.getFullYear();
const lastMonth=currentMonth===0?11:currentMonth-1;
const lastMonthYear=currentMonth===0?currentYear-1:currentYear;
const spendingMap={};
mockTransactions.forEach(t=>{
const tDate=new Date(t.date);
if(!spendingMap[t.cardId]){
spendingMap[t.cardId]={cardId:t.cardId,currentMonthSpend:0,lastMonthSpend:0,yearToDateSpend:0,transactionCount:0};
}
if(tDate.getFullYear()===currentYear){
spendingMap[t.cardId].yearToDateSpend+=t.amount;
spendingMap[t.cardId].transactionCount++;
if(tDate.getMonth()===currentMonth){
spendingMap[t.cardId].currentMonthSpend+=t.amount;
}
}
if(tDate.getFullYear()===lastMonthYear&&tDate.getMonth()===lastMonth){
spendingMap[t.cardId].lastMonthSpend+=t.amount;
}
});
const result=Object.values(spendingMap);
setTimeout(()=>deferred.resolve(result),300);
return deferred.promise;
}
};
}]);
})();
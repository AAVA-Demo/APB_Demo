(function(){
'use strict';
angular.module('creditCardApp').service('CardManagementService',['TransactionFactory','$http','$q','AuthService',function(TransactionFactory,$http,$q,AuthService){
const self=this;
const cardCache=new Map();
self.getAllCards=function(){
const userId=AuthService.getUserId();
const mockCards=[
{id:'card-001',cardNumber:'**** **** **** 1234',cardType:'Visa',bankName:'HDFC Bank',creditLimit:50000,availableCredit:35000,outstandingAmount:15000,expiryDate:'12/2026'},
{id:'card-002',cardNumber:'**** **** **** 5678',cardType:'MasterCard',bankName:'ICICI Bank',creditLimit:30000,availableCredit:28000,outstandingAmount:2000,expiryDate:'08/2025'},
{id:'card-003',cardNumber:'**** **** **** 9012',cardType:'Visa',cardType:'Visa',bankName:'SBI',creditLimit:20000,availableCredit:15000,outstandingAmount:5000,expiryDate:'03/2027'}
];
mockCards.forEach(function(card){cardCache.set(card.id,card);});
return $q.resolve(mockCards);
};
self.getCardDetails=function(cardId){
if(cardCache.has(cardId)){
return $q.resolve(cardCache.get(cardId));
}
return self.getAllCards().then(function(){
return cardCache.get(cardId);
});
};
self.computeSpendAnalysis=function(transactions){
let totalSpend=0;
const categoryMap={};
transactions.forEach(function(txn){
totalSpend+=txn.amount;
categoryMap[txn.category]=(categoryMap[txn.category]||0)+txn.amount;
});
const topCategories=Object.keys(categoryMap).map(function(cat){
return{category:cat,amount:categoryMap[cat]};
}).sort(function(a,b){return b.amount-a.amount;}).slice(0,3);
return{
cardId:transactions[0]?transactions[0].cardId:null,
totalSpend:totalSpend,
transactionCount:transactions.length,
topCategories:topCategories
};
};
}]);
})();
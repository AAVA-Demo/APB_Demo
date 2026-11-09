(function(){
'use strict';
angular.module('creditCardApp').service('CategorizationService',CategorizationService);
CategorizationService.$inject=[];
function CategorizationService(){
var service=this;
service.categorizeTransactions=categorizeTransactions;
var categoryRules=new Map([['restaurant','Food & Dining'],['cafe','Food & Dining'],['dining','Food & Dining'],['gas','Fuel'],['fuel','Fuel'],['petrol','Fuel'],['shop','Shopping'],['store','Shopping'],['mall','Shopping'],['flight','Travel'],['hotel','Travel'],['travel','Travel'],['movie','Entertainment'],['cinema','Entertainment'],['entertainment','Entertainment'],['electric','Utilities'],['water','Utilities'],['utility','Utilities'],['hospital','Healthcare'],['clinic','Healthcare'],['pharmacy','Healthcare'],['school','Education'],['university','Education'],['education','Education']]);
function categorizeTransactions(transactions){
return transactions.map(function(txn){
if(!txn.category){
txn.category=detectCategory(txn.merchantName||txn.description);
}
return txn;
});
}
function detectCategory(text){
if(!text)return'Miscellaneous';
var lowerText=text.toLowerCase();
for(var[keyword,category]of categoryRules){
if(lowerText.includes(keyword)){
return category;
}
}
return'Miscellaneous';
}
}
})();
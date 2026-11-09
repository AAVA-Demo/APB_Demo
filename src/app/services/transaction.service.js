(function(){
'use strict';
angular.module('creditCardApp').service('TransactionService',['$http','$q',function($http,$q){
var self=this;
var cache={};
self.getTransactions=function(page,pageSize){
var deferred=$q.defer();
var cacheKey='page_'+page+'_size_'+pageSize;
if(cache[cacheKey]){
deferred.resolve(cache[cacheKey]);
return deferred.promise;
}
var mockTransactions=generateMockTransactions(500);
var start=(page-1)*pageSize;
var end=start+pageSize;
var result={
transactions:mockTransactions.slice(start,end),
totalCount:mockTransactions.length
};
cache[cacheKey]=result;
deferred.resolve(result);
return deferred.promise;
};
function generateMockTransactions(count){
var transactions=[];
var merchants=['Amazon','Walmart','Starbucks','Shell Gas','Target','Best Buy','Whole Foods','CVS Pharmacy','McDonald\'s','Uber'];
var categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
var cards=['****1234','****5678','****9012'];
for(var i=0;i<count;i++){
var date=new Date();
date.setDate(date.getDate()-Math.floor(Math.random()*90));
transactions.push({
transactionId:'TXN'+String(i+1).padStart(6,'0'),
cardId:'CARD'+Math.floor(Math.random()*3+1),
cardNumber:cards[Math.floor(Math.random()*cards.length)],
merchantName:merchants[Math.floor(Math.random()*merchants.length)],
category:categories[Math.floor(Math.random()*categories.length)],
amount:parseFloat((Math.random()*500+10).toFixed(2)),
currency:'USD',
transactionDate:date,
status:'Completed',
description:'Transaction at merchant'
});
}
return transactions.sort(function(a,b){return b.transactionDate-a.transactionDate;});
}
}]);
})();
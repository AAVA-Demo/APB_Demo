(function(){
'use strict';
angular.module('creditCardApp').service('TransactionDataService',TransactionDataService);
TransactionDataService.$inject=['$http','$q','API_BASE_URL','$cacheFactory'];
function TransactionDataService($http,$q,API_BASE_URL,$cacheFactory){
var service=this;
var cache=$cacheFactory('transactionCache');
service.getTransactions=getTransactions;
function getTransactions(months,cardId){
var cacheKey='transactions-'+months+(cardId?'-'+cardId:'');
var cached=cache.get(cacheKey);
if(cached){
return $q.resolve(cached);
}
var url=API_BASE_URL+'/transactions?months='+months;
if(cardId){
url+='&cardId='+cardId;
}
return $http.get(url).then(function(response){
var transactions=response.data||mockTransactions(months);
cache.put(cacheKey,transactions);
return transactions;
}).catch(function(err){
var mockData=mockTransactions(months);
cache.put(cacheKey,mockData);
return mockData;
});
}
function mockTransactions(months){
var categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
var transactions=[];
var startDate=new Date();
startDate.setMonth(startDate.getMonth()-months);
for(var i=0;i<200;i++){
var txnDate=new Date(startDate.getTime()+Math.random()*(months*30*24*60*60*1000));
transactions.push({transactionId:'txn-'+i,cardId:'card-00'+(Math.floor(Math.random()*3)+1),amount:Math.floor(Math.random()*5000)+100,category:categories[Math.floor(Math.random()*categories.length)],merchantName:'Merchant '+i,transactionDate:txnDate.toISOString().substring(0,10),description:'Transaction '+i});
}
return transactions;
}
}
})();
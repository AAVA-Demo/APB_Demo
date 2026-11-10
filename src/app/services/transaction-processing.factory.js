(function(){
'use strict';
angular.module('creditCardApp').factory('TransactionProcessingFactory',TransactionProcessingFactory);
TransactionProcessingFactory.$inject=['$resource','API_ENDPOINT'];
function TransactionProcessingFactory($resource,API_ENDPOINT){
return $resource(API_ENDPOINT+'/transactions',{page:'@page',size:'@size'},{fetchTransactions:{method:'GET',interceptor:{response:function(response){
var mockData=[];
var categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
var merchants=['Restaurant A','Gas Station B','Store C','Airline D','Cinema E','Electric Co','Hospital F','University G','Misc H'];
for(var i=0;i<100;i++){
var d=new Date();
d.setDate(d.getDate()-Math.floor(Math.random()*365));
mockData.push({transactionId:'TXN'+i,cardId:'CC00'+(Math.floor(Math.random()*3)+1),amount:Math.floor(Math.random()*5000)+100,category:categories[Math.floor(Math.random()*categories.length)],date:d.toISOString(),merchant:merchants[Math.floor(Math.random()*merchants.length)],description:'Transaction '+i});
}
return{data:mockData,totalRecords:100};
}}},fetchTrends:{method:'GET',url:API_ENDPOINT+'/transactions/trends',interceptor:{response:function(response){
var trends=[];
for(var i=0;i<12;i++){
var d=new Date();
d.setMonth(d.getMonth()-i);
trends.push({month:d.toISOString().substring(0,7),totalSpend:Math.floor(Math.random()*30000)+10000,transactionCount:Math.floor(Math.random()*50)+20});
}
return response.data||trends;
}}}});
}
})();
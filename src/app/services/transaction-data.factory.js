(function(){
'use strict';
angular.module('creditCardApp').factory('TransactionDataFactory',TransactionDataFactory);
TransactionDataFactory.$inject=['$resource','API_ENDPOINT'];
function TransactionDataFactory($resource,API_ENDPOINT){
return $resource(API_ENDPOINT+'/transactions',{},{fetchTransactions:{method:'GET',isArray:true,interceptor:{response:function(response){
var mockData=[];
var categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
var merchants=['Restaurant A','Gas Station B','Store C','Airline D','Cinema E','Electric Co','Hospital F','University G','Misc H'];
for(var i=0;i<50;i++){
var d=new Date();
d.setDate(d.getDate()-Math.floor(Math.random()*90));
mockData.push({transactionId:'TXN'+i,cardId:'CC00'+(Math.floor(Math.random()*3)+1),amount:Math.floor(Math.random()*5000)+100,category:categories[Math.floor(Math.random()*categories.length)],date:d.toISOString(),merchant:merchants[Math.floor(Math.random()*merchants.length)]});
}
return response.data||mockData;
}}}});
}
})();
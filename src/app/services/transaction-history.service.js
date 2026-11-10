(function(){
'use strict';
angular.module('creditCardApp').service('TransactionHistoryService',['$http','$q',function($http,$q){
var vm=this;
vm.fetchHistoricalTransactions=function(userId,months){
var mockTransactions=[];
var categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
for(var m=0;m<months;m++){
var monthDate=new Date();
monthDate.setMonth(monthDate.getMonth()-m);
for(var i=0;i<Math.floor(Math.random()*50)+20;i++){
var cat=categories[Math.floor(Math.random()*categories.length)];
mockTransactions.push({id:'txn'+m+'_'+i,userId:userId,cardId:'card00'+(Math.floor(Math.random()*3)+1),amount:Math.floor(Math.random()*5000)+100,category:cat,description:'Transaction '+i,transactionDate:new Date(monthDate.getFullYear(),monthDate.getMonth(),Math.floor(Math.random()*28)+1),merchantName:'Merchant '+i});
}
}
return $q.resolve(mockTransactions);
};
}]);
})();
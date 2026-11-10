(function(){
'use strict';
angular.module('creditCardApp').service('TransactionDataService',['$http','$q',function($http,$q){
var vm=this;
vm.fetchCategorizedTransactions=function(userId){
var categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
var mockTransactions=[];
for(var i=0;i<150;i++){
var cat=categories[Math.floor(Math.random()*categories.length)];
mockTransactions.push({id:'txn'+i,userId:userId,cardId:'card00'+(Math.floor(Math.random()*3)+1),amount:Math.floor(Math.random()*5000)+100,category:cat,description:'Transaction '+i,transactionDate:new Date(Date.now()-Math.random()*365*24*60*60*1000),merchantName:'Merchant '+i});
}
return $q.resolve(mockTransactions);
};
}]);
})();
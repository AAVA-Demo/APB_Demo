(function(){
'use strict';
angular.module('creditCardApp').factory('TransactionCategorizationFactory',['$http','$q',function($http,$q){
const factory={};
const categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
factory.fetchTransactions=function(period){
const mockData=[];
const now=new Date();
for(let i=0;i<12;i++){
const monthDate=new Date(now.getFullYear(),now.getMonth()-i,15);
const txnCount=Math.floor(Math.random()*20)+10;
for(let j=0;j<txnCount;j++){
const category=categories[Math.floor(Math.random()*categories.length)];
mockData.push({
id:'txn-'+i+'-'+j,
cardId:'card-00'+(Math.floor(Math.random()*3)+1),
amount:Math.floor(Math.random()*5000)+100,
category:category,
date:new Date(monthDate.getFullYear(),monthDate.getMonth(),Math.floor(Math.random()*28)+1),
merchant:'Merchant-'+j,
description:'Transaction '+j
});
}
}
return $q.resolve(mockData);
};
return factory;
}]);
})();
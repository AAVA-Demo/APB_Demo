(function(){
'use strict';
angular.module('creditCardApp')
.service('TransactionApiService',['$http','$q','AuthService',function($http,$q,AuthService){
var self=this;
var BASE_URL='/api';
function getHeaders(){
return{Authorization:'Bearer '+AuthService.getToken()};
}
self.getTransactions=function(months){
var deferred=$q.defer();
var categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
var mockTransactions=[];
var startDate=new Date();
startDate.setMonth(startDate.getMonth()-months);
for(var i=0;i<200;i++){
var txDate=new Date(startDate.getTime()+Math.random()*(Date.now()-startDate.getTime()));
var category=categories[Math.floor(Math.random()*categories.length)];
mockTransactions.push({
transactionId:'tx'+i,
cardId:'card'+(Math.floor(Math.random()*5)+1),
amount:parseFloat((Math.random()*5000+100).toFixed(2)),
date:txDate,
merchantName:'Merchant '+i,
category:category
});
}
deferred.resolve(mockTransactions);
return deferred.promise;
};
}]);
})();
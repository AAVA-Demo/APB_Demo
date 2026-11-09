(function(){
'use strict';
angular.module('creditCardApp').service('AnalyticsService',['CategorizationService','AggregationService','$http','$q',function(CategorizationService,AggregationService,$q){
var self=this;
self.getAnalyticsData=function(){
var deferred=$q.defer();
var mockTransactions=generateMockAnalyticsTransactions();
var categorized=CategorizationService.categorize(mockTransactions);
var monthlyTrends=AggregationService.aggregateByMonth(categorized);
var cardWiseSpend=AggregationService.aggregateByCard(categorized);
var categoryWiseSpend=AggregationService.aggregateByCategory(categorized);
var analyticsData={
monthlyTrends:monthlyTrends,
cardWiseSpend:cardWiseSpend,
categoryWiseSpend:categoryWiseSpend,
period:{startDate:new Date(new Date().setMonth(new Date().getMonth()-12)),endDate:new Date()}
};
deferred.resolve(analyticsData);
return deferred.promise;
};
function generateMockAnalyticsTransactions(){
var transactions=[];
var categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
var cards=[{id:'CARD1',name:'Visa Gold'},{id:'CARD2',name:'Mastercard Platinum'},{id:'CARD3',name:'Amex Blue'}];
for(var i=0;i<12;i++){
var monthDate=new Date();
monthDate.setMonth(monthDate.getMonth()-i);
for(var j=0;j<30;j++){
var card=cards[Math.floor(Math.random()*cards.length)];
transactions.push({
transactionId:'ATXN'+i+'_'+j,
cardId:card.id,
cardName:card.name,
category:categories[Math.floor(Math.random()*categories.length)],
amount:parseFloat((Math.random()*300+20).toFixed(2)),
transactionDate:monthDate
});
}
}
return transactions;
}
}]);
})();
(function(){
'use strict';
angular.module('creditCardApp').service('CardAnalysisService',['$http','$q',function($http,$q){
var self=this;
self.analyzeCards=function(cardIds){
var deferred=$q.defer();
var mockAnalysis=cardIds.map(function(id){
return{
cardId:id,
monthlySpend:Math.floor(Math.random()*15000)+5000,
utilizationRate:Math.floor(Math.random()*50)+20,
categoryBreakdown:[
{category:'Food & Dining',amount:3000},
{category:'Fuel',amount:2000},
{category:'Shopping',amount:4000}
]
};
});
deferred.resolve(mockAnalysis);
return deferred.promise;
};
}]);
})();
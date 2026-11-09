(function(){
'use strict';
angular.module('portfolioModule').service('dataAggregationService',['cardDataService','kpiCalculationService','$q',function(cardDataService,kpiCalculationService,$q){
this.getAggregatedData=function(){
return cardDataService.getAllCards().then(function(cards){
var kpis=kpiCalculationService.calculateKPIs(cards);
return{cards:cards,kpis:kpis};
},function(error){
return $q.reject(error);
});
};
}]);
})();
(function(){
'use strict';
angular.module('creditCardApp').service('AnalyticsService',['ApiFactory','CategoryService','$cacheFactory','$q',function(ApiFactory,CategoryService,$cacheFactory,$q){
const cache=$cacheFactory('analyticsCache');
const CACHE_KEY='insights';
const CACHE_TTL=60000;
this.getSpendingInsights=function(){
const cached=cache.get(CACHE_KEY);
if(cached&&(Date.now()-cached.timestamp<CACHE_TTL)){
return $q.resolve(cached.data);
}
return ApiFactory.get('/analytics/spending').then(function(response){
const insights={monthlyTrends:response.monthlyTrends||[],cardWiseSpend:response.cardWiseSpend||[],categoryWiseSpend:response.categoryWiseSpend||[]};
cache.put(CACHE_KEY,{data:insights,timestamp:Date.now()});
return insights;
});
};
}]);
})();
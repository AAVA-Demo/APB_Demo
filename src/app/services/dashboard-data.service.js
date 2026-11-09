(function(){
'use strict';
angular.module('creditCardApp').service('DashboardDataService',['ApiFactory','$q','$cacheFactory',function(ApiFactory,$q,$cacheFactory){
const cache=$cacheFactory('dashboardCache');
const CACHE_KEY='kpis';
const CACHE_TTL=30000;
this.getKPIs=function(){
const cached=cache.get(CACHE_KEY);
if(cached&&(Date.now()-cached.timestamp<CACHE_TTL)){
return $q.resolve(cached.data);
}
return ApiFactory.get('/dashboard/kpis').then(function(response){
const kpis={totalCreditLimit:response.totalCreditLimit||0,totalAvailableCredit:response.totalAvailableCredit||0,totalOutstanding:response.totalOutstanding||0,currentMonthSpend:response.currentMonthSpend||0,cards:response.cards||[]};
cache.put(CACHE_KEY,{data:kpis,timestamp:Date.now()});
return kpis;
});
};
}]);
})();
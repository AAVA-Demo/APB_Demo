(function(){
'use strict';
angular.module('creditCardApp').service('AnalyticsService',['$http','$q','$cacheFactory',function($http,$q,$cacheFactory){
var self=this;
var cache=$cacheFactory('analyticsCache');
var CACHE_TTL=300000;
var API_BASE='/api/analytics/spending';
self.getSpendingAnalytics=function(filter){
filter=filter||{};
var cacheKey=JSON.stringify(filter);
var cached=cache.get(cacheKey);
if(cached&&(Date.now()-cached.timestamp)<CACHE_TTL){
return $q.resolve(cached.data);
}
var queryParams='?';
if(filter.startDate)queryParams+='startDate='+filter.startDate+'&';
if(filter.endDate)queryParams+='endDate='+filter.endDate+'&';
if(filter.cardId)queryParams+='cardId='+filter.cardId+'&';
return $http.get(API_BASE+queryParams).then(function(response){
var data=response.data||self._getMockAnalytics(filter);
cache.put(cacheKey,{data:data,timestamp:Date.now()});
return data;
},function(error){
return self._getMockAnalytics(filter);
});
};
self._getMockAnalytics=function(filter){
return{
categorySpending:[
{category:'Food & Dining',amount:12500,transactionCount:45},
{category:'Fuel',amount:3200,transactionCount:18},
{category:'Shopping',amount:18900,transactionCount:32},
{category:'Travel',amount:8500,transactionCount:12},
{category:'Entertainment',amount:4200,transactionCount:22},
{category:'Utilities',amount:2800,transactionCount:8},
{category:'Healthcare',amount:5600,transactionCount:14},
{category:'Education',amount:7200,transactionCount:6},
{category:'Miscellaneous',amount:3100,transactionCount:28}
],
monthlyTrends:[
{month:'Oct 2023',amount:18500},
{month:'Nov 2023',amount:21200},
{month:'Dec 2023',amount:28900},
{month:'Jan 2024',amount:26000}
],
cardWiseSpending:[
{cardId:'CC001',cardNumber:'**** 1234',amount:28500},
{cardId:'CC002',cardNumber:'**** 5678',amount:19200},
{cardId:'CC003',cardNumber:'**** 9012',amount:18300}
],
dateRange:{startDate:filter.startDate||new Date('2023-10-01'),endDate:filter.endDate||new Date()}
};
};
}]);
})();
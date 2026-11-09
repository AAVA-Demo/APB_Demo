(function(){
'use strict';
angular.module('creditCardApp').service('AnalyticsService',['$http','$q','API_CONFIG',function($http,$q,API_CONFIG){
const self=this;
self.getSpendingAnalytics=function(dateRange){
const deferred=$q.defer();
let url=API_CONFIG.baseUrl+'/analytics/spending';
if(dateRange&&dateRange.startDate&&dateRange.endDate){
url+='?startDate='+dateRange.startDate+'&endDate='+dateRange.endDate;
}
$http.get(url,{timeout:API_CONFIG.timeout}).then(function(response){
deferred.resolve(response.data);},function(error){
deferred.reject(error);});
return deferred.promise;
};
self.getTransactionsByCategory=function(category){
const deferred=$q.defer();
$http.get(API_CONFIG.baseUrl+'/transactions?category='+category,{timeout:API_CONFIG.timeout}).then(function(response){
deferred.resolve(response.data);},function(error){
deferred.reject(error);});
return deferred.promise;
};
self.getMockAnalytics=function(){
return{categories:[{category:'Food & Dining',amount:2500,percentage:25,transactionCount:45},{category:'Fuel',amount:1800,percentage:18,transactionCount:12},{category:'Shopping',amount:3200,percentage:32,transactionCount:28},{category:'Travel',amount:1200,percentage:12,transactionCount:8},{category:'Entertainment',amount:800,percentage:8,transactionCount:15},{category:'Utilities',amount:300,percentage:3,transactionCount:5},{category:'Healthcare',amount:150,percentage:1.5,transactionCount:3},{category:'Education',amount:0,percentage:0,transactionCount:0},{category:'Miscellaneous',amount:50,percentage:0.5,transactionCount:2}],monthlyTrends:[{month:'Aug 2023',totalSpend:8500,cardWiseSpend:[{cardId:'CC001',amount:5500},{cardId:'CC002',amount:3000}]},{month:'Sep 2023',totalSpend:9200,cardWiseSpend:[{cardId:'CC001',amount:6000},{cardId:'CC002',amount:3200}]},{month:'Oct 2023',totalSpend:7800,cardWiseSpend:[{cardId:'CC001',amount:4800},{cardId:'CC002',amount:3000}]},{month:'Nov 2023',totalSpend:10500,cardWiseSpend:[{cardId:'CC001',amount:7000},{cardId:'CC002',amount:3500}]},{month:'Dec 2023',totalSpend:12000,cardWiseSpend:[{cardId:'CC001',amount:8000},{cardId:'CC002',amount:4000}]},{month:'Jan 2024',totalSpend:10000,cardWiseSpend:[{cardId:'CC001',amount:6500},{cardId:'CC002',amount:3500}]}],totalSpend:10000,period:{startDate:new Date('2023-08-01'),endDate:new Date('2024-01-31')}};
};
}]);
})();
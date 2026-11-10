(function(){
'use strict';
angular.module('analyticsModule').controller('AnalyticsDashboardController',['$scope','AnalyticsService','AuthService',function($scope,AnalyticsService,AuthService){
var vm=this;
vm.activeView='category';
vm.categoryData=[];
vm.trendData=[];
vm.cardData=[];
vm.loading=true;
vm.error=null;
function init(){
var userId=AuthService.getUserId();
if(!userId){
vm.error='User not authenticated';
vm.loading=false;
return;
}
loadCategoryData(userId);
}
function loadCategoryData(userId){
vm.loading=true;
AnalyticsService.getCategorySpend(userId,12).then(function(data){
vm.categoryData=data;
vm.loading=false;
}).catch(function(error){
vm.error='Failed to load category data';
vm.loading=false;
});
}
function loadTrendData(userId){
vm.loading=true;
AnalyticsService.getMonthlyTrend(userId,12).then(function(data){
vm.trendData=data;
vm.loading=false;
}).catch(function(error){
vm.error='Failed to load trend data';
vm.loading=false;
});
}
function loadCardData(userId){
vm.loading=true;
AnalyticsService.getCardSpend(userId).then(function(data){
vm.cardData=data;
vm.loading=false;
}).catch(function(error){
vm.error='Failed to load card data';
vm.loading=false;
});
}
vm.switchView=function(view){
var userId=AuthService.getUserId();
vm.activeView=view;
if(view==='category')loadCategoryData(userId);
else if(view==='trend')loadTrendData(userId);
else if(view==='card')loadCardData(userId);
};
init();
}]);
})();
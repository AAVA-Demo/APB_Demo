(function(){
'use strict';
angular.module('app.analytics').controller('AnalyticsController',['$scope','AnalyticsService',function($scope,AnalyticsService){
const vm=this;
vm.categoryData=[];
vm.monthlyData=[];
vm.cardWiseData=[];
vm.currentView='category';
vm.loading=true;
vm.error=null;
vm.init=function(){
vm.loadCategorySpending();
};
vm.loadCategorySpending=function(){
vm.loading=true;
AnalyticsService.getCategorySpending().then(function(data){
vm.categoryData=data;
vm.loading=false;
}).catch(function(error){
vm.error='Failed to load category spending data';
vm.loading=false;
});
};
vm.loadMonthlyTrends=function(){
vm.loading=true;
AnalyticsService.getMonthlyTrends().then(function(data){
vm.monthlyData=data;
vm.loading=false;
}).catch(function(error){
vm.error='Failed to load monthly trends data';
vm.loading=false;
});
};
vm.loadCardWiseSpend=function(){
vm.loading=true;
AnalyticsService.getCardWiseSpend().then(function(data){
vm.cardWiseData=data;
vm.loading=false;
}).catch(function(error){
vm.error='Failed to load card-wise spend data';
vm.loading=false;
});
};
vm.switchView=function(view){
vm.currentView=view;
if(view==='category'&&vm.categoryData.length===0){
vm.loadCategorySpending();
}else if(view==='monthly'&&vm.monthlyData.length===0){
vm.loadMonthlyTrends();
}else if(view==='cardwise'&&vm.cardWiseData.length===0){
vm.loadCardWiseSpend();
}
};
vm.init();
}]);
})();
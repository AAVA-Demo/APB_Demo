(function(){
'use strict';
angular.module('app.analytics').directive('categoryChart',['ChartFactory',function(ChartFactory){
return{restrict:'E',scope:{analyticsData:'=',onCategoryClick:'&'},template:'<canvas id="categoryChart" width="400" height="300"></canvas>',link:function(scope,element){
let chart=null;
scope.$on('analyticsDataLoaded',function(event,data){
if(chart){chart.destroy();}
const ctx=element.find('canvas')[0].getContext('2d');
const categories=data.categories.filter(function(c){return c.amount>0;});
const labels=categories.map(function(c){return c.category;});
const amounts=categories.map(function(c){return c.amount;});
chart=ChartFactory.createPieChart(ctx,amounts,labels);
element.find('canvas').on('click',function(evt){
const activePoints=chart.getElementsAtEvent(evt);
if(activePoints.length>0){
const clickedIndex=activePoints[0]._index;
const category=labels[clickedIndex];
scope.onCategoryClick({category:category});
scope.$apply();
}
});
});
if(scope.analyticsData){
const ctx=element.find('canvas')[0].getContext('2d');
const categories=scope.analyticsData.categories.filter(function(c){return c.amount>0;});
const labels=categories.map(function(c){return c.category;});
const amounts=categories.map(function(c){return c.amount;});
chart=ChartFactory.createPieChart(ctx,amounts,labels);
}
scope.$on('$destroy',function(){
if(chart){chart.destroy();}
});
}};
}]);
})();
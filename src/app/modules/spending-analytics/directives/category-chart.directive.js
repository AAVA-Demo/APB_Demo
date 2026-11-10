(function(){
'use strict';
angular.module('spendingAnalyticsModule').directive('categoryChart',['CategoryFactory',function(CategoryFactory){
return{
restrict:'E',
scope:{categorySpending:'=',onSelect:'&'},
template:'<canvas id="categoryChart" width="400" height="200"></canvas>',
link:function(scope,element,attrs){
var ctx=element.find('canvas')[0].getContext('2d');
var chart=null;
scope.$watch('categorySpending',function(newVal){
if(newVal&&newVal.length>0){
var labels=[];
var data=[];
var colors=[];
angular.forEach(newVal,function(cat){
labels.push(cat.categoryName);
data.push(cat.totalAmount);
colors.push(CategoryFactory.getCategoryColor(cat.categoryName));
});
if(chart){
chart.destroy();
}
chart=new Chart(ctx,{type:'pie',data:{labels:labels,datasets:[{data:data,backgroundColor:colors}]},options:{responsive:true,onClick:function(evt,item){
if(item.length>0){
var index=item[0]._index;
var categoryName=labels[index];
scope.$apply(function(){
scope.onSelect({categoryName:categoryName});
});
}
}}});
}
});
}
};
}]);
})();
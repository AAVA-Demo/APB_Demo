(function(){
'use strict';
angular.module('spendingAnalyticsModule').directive('categoryChart',[function(){
return{
restrict:'E',
scope:{data:'=',onSelect:'&'},
template:'<canvas id="categoryChart" width="400" height="400"></canvas>',
link:function(scope,element,attrs){
var ctx=element.find('canvas')[0].getContext('2d');
var chart=null;
scope.$watch('data',function(newData){
if(newData&&newData.categoryBreakdown){
var labels=newData.categoryBreakdown.map(function(c){return c.category;});
var data=newData.categoryBreakdown.map(function(c){return c.totalSpend;});
var colors=['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0'];
if(chart){chart.destroy();}
chart=new Chart(ctx,{type:'pie',data:{labels:labels,datasets:[{data:data,backgroundColor:colors}]},options:{responsive:true,onClick:function(evt,item){
if(item.length>0){
var index=item[0]._index;
var category=labels[index];
scope.onSelect({category:category});
scope.$apply();
}
}}});
}
},true);
}
};
}]);
})();
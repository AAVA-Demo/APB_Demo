(function(){
'use strict';
angular.module('analyticsModule').directive('spendingChart',['$timeout',function($timeout){
return{restrict:'E',scope:{data:'=',onSelect:'&'},template:'<canvas id="spendingChart"></canvas>',link:function(scope,element){
var canvas=element.find('canvas')[0];
var chart=null;
scope.$watch('data',function(newData){
if(newData&&newData.length>0){
$timeout(function(){
var labels=newData.map(function(d){return d.categoryName;});
var amounts=newData.map(function(d){return d.totalAmount;});
if(chart)chart.destroy();
var ctx=canvas.getContext('2d');
chart=new Chart(ctx,{type:'pie',data:{labels:labels,datasets:[{data:amounts,backgroundColor:['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0']}]},options:{responsive:true,onClick:function(evt,item){
if(item.length>0){
var index=item[0]._index;
scope.$apply(function(){
scope.onSelect({category:newData[index]});
});
}
}}});
},0);
}
});
scope.$on('$destroy',function(){
if(chart)chart.destroy();
});
}};
}]);
})();
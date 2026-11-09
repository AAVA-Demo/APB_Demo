(function(){
'use strict';
angular.module('analyticsModule').directive('categoryChart',['$window',function($window){
return{
restrict:'E',
scope:{data:'='},
template:'<canvas id="categoryChart" width="400" height="200"></canvas>',
link:function(scope,element,attrs){
let chart=null;
scope.$watch('data',function(newData){
if(newData&&newData.length>0){
const ctx=element.find('canvas')[0].getContext('2d');
if(chart)chart.destroy();
const labels=newData.map(function(d){return d.category;});
const values=newData.map(function(d){return d.totalAmount;});
chart=new Chart(ctx,{type:'pie',data:{labels:labels,datasets:[{data:values,backgroundColor:['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0']}]},options:{responsive:true,maintainAspectRatio:false}});
}
},true);
angular.element($window).on('resize',function(){
if(chart)chart.resize();
});
scope.$on('$destroy',function(){
if(chart)chart.destroy();
});
}
};
}]);
})();
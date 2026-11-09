(function(){
'use strict';
angular.module('creditCardApp').factory('ChartFactory',[function(){
return{createPieChart:function(ctx,data,labels){
return new Chart(ctx,{type:'pie',data:{labels:labels,datasets:[{data:data,backgroundColor:['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0']}]},options:{responsive:true,maintainAspectRatio:true,legend:{position:'bottom'}}});
},createLineChart:function(ctx,data,labels){
return new Chart(ctx,{type:'line',data:{labels:labels,datasets:[{label:'Total Spend',data:data,borderColor:'#36A2EB',backgroundColor:'rgba(54,162,235,0.2)',fill:true}]},options:{responsive:true,maintainAspectRatio:true,scales:{yAxes:[{ticks:{beginAtZero:true,callback:function(value){return'$'+value;}}}]}}});
},createBarChart:function(ctx,datasets,labels){
return new Chart(ctx,{type:'bar',data:{labels:labels,datasets:datasets},options:{responsive:true,maintainAspectRatio:true,scales:{yAxes:[{ticks:{beginAtZero:true,callback:function(value){return'$'+value;}}}]}}});
}};
}]);
})();
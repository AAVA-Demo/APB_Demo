(function(){
'use strict';
angular.module('creditCardApp').factory('chartConfigFactory',[function(){
return{getLineChartConfig:function(labels,data,label){
return{type:'line',data:{labels:labels,datasets:[{label:label||'Spend',data:data,borderColor:'rgb(75,192,192)',backgroundColor:'rgba(75,192,192,0.2)',tension:0.1}]},options:{responsive:true,maintainAspectRatio:false,scales:{y:{beginAtZero:true}}}};},getPieChartConfig:function(labels,data){
var colors=['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0'];
return{type:'pie',data:{labels:labels,datasets:[{data:data,backgroundColor:colors}]},options:{responsive:true,maintainAspectRatio:false}};
}};
}]);
})();
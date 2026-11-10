(function(){
'use strict';
angular.module('creditCardApp').factory('ChartDataFactory',['CategoryService',function(CategoryService){
return{
transformToPieChart:function(categorySpending){
var labels=[];
var data=[];
var colors=[];
categorySpending.forEach(function(item){
labels.push(item.category);
data.push(item.amount);
colors.push(CategoryService.getCategoryColor(item.category));
});
return{
labels:labels,
datasets:[{label:'Spending by Category',data:data,backgroundColor:colors}],
options:{responsive:true,maintainAspectRatio:false,legend:{position:'right'},onClick:function(evt,item){if(item.length>0){var idx=item[0]._index;var category=labels[idx];console.log('Drill down to category:',category);}}}
};
},
transformToLineChart:function(monthlyTrends){
var labels=[];
var data=[];
monthlyTrends.forEach(function(item){
labels.push(item.month);
data.push(item.amount);
});
return{
labels:labels,
datasets:[{label:'Monthly Spend',data:data,borderColor:'#36A2EB',backgroundColor:'rgba(54,162,235,0.2)',fill:true}],
options:{responsive:true,maintainAspectRatio:false,scales:{yAxes:[{ticks:{beginAtZero:true,callback:function(value){return'$'+value.toLocaleString();}}}]}}
};
},
transformToBarChart:function(cardWiseSpending){
var labels=[];
var data=[];
cardWiseSpending.forEach(function(item){
labels.push(item.cardNumber);
data.push(item.amount);
});
return{
labels:labels,
datasets:[{label:'Card-wise Spending',data:data,backgroundColor:'#FFCE56'}],
options:{responsive:true,maintainAspectRatio:false,scales:{yAxes:[{ticks:{beginAtZero:true,callback:function(value){return'$'+value.toLocaleString();}}}]}}
};
}
};
}]);
})();
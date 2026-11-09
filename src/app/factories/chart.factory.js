(function(){
'use strict';
angular.module('creditCardApp').factory('ChartFactory',[function(){
var factory={};
factory.createLineChart=function(monthlyTrends){
var labels=monthlyTrends.map(function(m){return m.month;});
var data=monthlyTrends.map(function(m){return m.totalSpend;});
return{
type:'line',
data:{
labels:labels,
datasets:[{
label:'Monthly Spend',
data:data,
borderColor:'rgb(75,192,192)',
backgroundColor:'rgba(75,192,192,0.2)',
tension:0.1
}]
},
options:{
responsive:true,
maintainAspectRatio:false,
animation:{duration:200},
scales:{yAxes:[{ticks:{beginAtZero:true}}]}
}
};
};
factory.createBarChart=function(cardWiseSpend){
var labels=cardWiseSpend.map(function(c){return c.cardName;});
var data=cardWiseSpend.map(function(c){return c.totalSpend;});
return{
type:'bar',
data:{
labels:labels,
datasets:[{
label:'Card-wise Spend',
data:data,
backgroundColor:['rgba(255,99,132,0.6)','rgba(54,162,235,0.6)','rgba(255,206,86,0.6)']
}]
},
options:{
responsive:true,
maintainAspectRatio:false,
animation:{duration:200},
scales:{yAxes:[{ticks:{beginAtZero:true}}]}
}
};
};
factory.createPieChart=function(categoryWiseSpend){
var labels=categoryWiseSpend.map(function(c){return c.category;});
var data=categoryWiseSpend.map(function(c){return c.amount;});
return{
type:'pie',
data:{
labels:labels,
datasets:[{
data:data,
backgroundColor:['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0']
}]
},
options:{
responsive:true,
maintainAspectRatio:false,
animation:{duration:200}
}
};
};
return factory;
}]);
})();
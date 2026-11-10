(function(){
'use strict';
angular.module('spendingAnalyticsModule').factory('CategoryFactory',[function(){
var categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
return{
getCategories:function(){
return categories;
},
getCategoryColor:function(category){
var colorMap={'Food & Dining':'#FF6384','Fuel':'#36A2EB','Shopping':'#FFCE56','Travel':'#4BC0C0','Entertainment':'#9966FF','Utilities':'#FF9F40','Healthcare':'#FF6384','Education':'#C9CBCF','Miscellaneous':'#4BC0C0'};
return colorMap[category]||'#CCCCCC';
}
};
}]);
})();
(function(){
'use strict';
angular.module('creditCardApp')
.service('CategorizationService',[function(){
var categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
this.categorizeAndAggregate=function(transactions){
if(!transactions||!transactions.length){
return{categories:[],totalSpend:0,transactions:[]};
}
var categoryMap=new Map();
categories.forEach(function(cat){
categoryMap.set(cat,{name:cat,amount:0,percentage:0,transactionCount:0});
});
var totalSpend=0;
transactions.forEach(function(t){
var cat=t.category||'Miscellaneous';
if(!categoryMap.has(cat)){
cat='Miscellaneous';
}
var catData=categoryMap.get(cat);
catData.amount+=t.amount;
catData.transactionCount++;
totalSpend+=t.amount;
});
var categoryArray=Array.from(categoryMap.values());
categoryArray.forEach(function(c){
c.amount=Number(c.amount.toFixed(2));
c.percentage=totalSpend>0?Number(((c.amount/totalSpend)*100).toFixed(2)):0;
});
return{categories:categoryArray,totalSpend:Number(totalSpend.toFixed(2)),transactions:transactions};
};
}]);
})();
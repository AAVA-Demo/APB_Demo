(function(){
'use strict';
angular.module('creditCardApp').service('CategorizationService',[function(){
var self=this;
var categoryMap={
'Food & Dining':['restaurant','cafe','starbucks','mcdonald','dining','food'],
'Fuel':['shell','gas','fuel','petrol','chevron'],
'Shopping':['amazon','walmart','target','shopping','store'],
'Travel':['uber','lyft','airline','hotel','travel'],
'Entertainment':['netflix','spotify','movie','entertainment'],
'Utilities':['electric','water','internet','utility'],
'Healthcare':['pharmacy','hospital','doctor','healthcare','cvs'],
'Education':['school','university','education','course'],
'Miscellaneous':['other','misc']
};
self.categorize=function(transactions){
return transactions.map(function(t){
if(!t.category||t.category===''){
t.category=detectCategory(t.merchantName||t.description||'');
}
return t;
});
};
function detectCategory(text){
var lowerText=text.toLowerCase();
for(var cat in categoryMap){
for(var i=0;i<categoryMap[cat].length;i++){
if(lowerText.indexOf(categoryMap[cat][i])!==-1){
return cat;
}
}
}
return'Miscellaneous';
}
}]);
})();
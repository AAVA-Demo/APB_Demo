(function(){
'use strict';
angular.module('creditCard.analytics').service('CategorizationService',function(){
const self=this;
const mccMap={
'5411':'Food & Dining',
'5812':'Food & Dining',
'5814':'Food & Dining',
'5542':'Fuel',
'5541':'Fuel',
'5311':'Shopping',
'5399':'Shopping',
'5651':'Shopping',
'3000':'Travel',
'3001':'Travel',
'4511':'Travel',
'7832':'Entertainment',
'7922':'Entertainment',
'4900':'Utilities',
'8011':'Healthcare',
'8062':'Healthcare',
'8211':'Education',
'8220':'Education'
};
const keywordMap={
'restaurant':'Food & Dining',
'cafe':'Food & Dining',
'grocery':'Food & Dining',
'gas':'Fuel',
'petrol':'Fuel',
'store':'Shopping',
'mall':'Shopping',
'airline':'Travel',
'hotel':'Travel',
'movie':'Entertainment',
'concert':'Entertainment',
'electric':'Utilities',
'water':'Utilities',
'hospital':'Healthcare',
'clinic':'Healthcare',
'school':'Education',
'university':'Education'
};
self.categorize=function(transaction){
if(transaction.mccCode && mccMap[transaction.mccCode]){
return mccMap[transaction.mccCode];
}
const merchant=(transaction.merchantName||'').toLowerCase();
for(const keyword in keywordMap){
if(merchant.includes(keyword)){
return keywordMap[keyword];
}
}
return'Miscellaneous';
};
});
})();
(function(){
'use strict';
angular.module('creditCardApp').factory('CategoryClassificationService',[function(){
var categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
function categorizeTransaction(transaction){
if(!transaction.category||categories.indexOf(transaction.category)===-1){
var merchant=(transaction.merchantName||'').toLowerCase();
if(merchant.includes('restaurant')||merchant.includes('cafe')||merchant.includes('food')){
transaction.category='Food & Dining';}else if(merchant.includes('gas')||merchant.includes('fuel')||merchant.includes('petrol')){
transaction.category='Fuel';}else if(merchant.includes('store')||merchant.includes('shop')||merchant.includes('mall')){
transaction.category='Shopping';}else if(merchant.includes('airline')||merchant.includes('hotel')||merchant.includes('travel')){
transaction.category='Travel';}else if(merchant.includes('movie')||merchant.includes('theater')||merchant.includes('entertainment')){
transaction.category='Entertainment';}else if(merchant.includes('electric')||merchant.includes('water')||merchant.includes('utility')){
transaction.category='Utilities';}else if(merchant.includes('hospital')||merchant.includes('clinic')||merchant.includes('pharmacy')){
transaction.category='Healthcare';}else if(merchant.includes('school')||merchant.includes('university')||merchant.includes('education')){
transaction.category='Education';}else{
transaction.category='Miscellaneous';}}
return transaction;}
return{categorizeTransactions:function(transactions){
return transactions.map(categorizeTransaction);},getCategories:function(){
return categories;}};
}]);
})();
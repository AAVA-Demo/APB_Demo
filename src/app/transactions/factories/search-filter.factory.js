(function(){
'use strict';
angular.module('transactionModule').factory('SearchFilterFactory',[function(){
var factory={};
factory.buildFilterQuery=function(criteria){
var query={};
if(criteria.cardId)query.cardId=criteria.cardId;
if(criteria.dateFrom)query.dateFrom=criteria.dateFrom;
if(criteria.dateTo)query.dateTo=criteria.dateTo;
if(criteria.searchTerm)query.search=criteria.searchTerm;
if(criteria.category)query.category=criteria.category;
if(criteria.minAmount)query.minAmount=criteria.minAmount;
if(criteria.maxAmount)query.maxAmount=criteria.maxAmount;
return query;
};
return factory;
}]);
})();
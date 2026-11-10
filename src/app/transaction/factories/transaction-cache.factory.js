(function() {
  'use strict';
  angular.module('transactionModule').factory('TransactionCache', TransactionCache);
  TransactionCache.$inject = ['$cacheFactory'];
  function TransactionCache($cacheFactory) {
    return $cacheFactory('transactionCache', { capacity: 50 });
  }
})();
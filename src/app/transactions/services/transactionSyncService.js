(function() {
  'use strict';
  angular.module('ccTransactionModule').factory('TransactionSyncService', ['$interval', '$rootScope', 'ApiService', 'TransactionService', function($interval, $rootScope, ApiService, TransactionService) {
    var syncInterval = null;
    return {
      startSync: function() {
        syncInterval = $interval(function() {
          ApiService.get('/api/transactions/sync').then(function(response) {
            if (response.data && response.data.length > 0) {
              TransactionService.invalidateCache();
              $rootScope.$broadcast('transaction:updated');
            }
          });
        }, 30000);
      },
      stopSync: function() {
        if (syncInterval) {
          $interval.cancel(syncInterval);
        }
      }
    };
  }]);
})();
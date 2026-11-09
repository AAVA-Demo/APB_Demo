(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('DashboardService', ['CreditCardAPI', 'TransactionAPI', '$q', '$cacheFactory', function(CreditCardAPI, TransactionAPI, $q, $cacheFactory) {
      const cache = $cacheFactory('dashboardCache');
      const CACHE_KEY = 'kpiData';
      const CACHE_TTL = 30000;

      this.getKPIData = function(userId) {
        const cachedData = cache.get(CACHE_KEY);
        if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
          return $q.resolve(cachedData.data);
        }

        const creditPromise = CreditCardAPI.getCreditSummary(userId);
        const transactionPromise = TransactionAPI.getTransactionSummary(userId);

        return $q.all([creditPromise, transactionPromise])
          .then(function(results) {
            const creditSummary = results[0];
            const transactionSummary = results[1];

            const kpiData = {
              userId: userId,
              monthlySpend: transactionSummary.monthlySpend || 0,
              totalCreditLimit: creditSummary.totalCreditLimit || 0,
              availableCredit: creditSummary.totalAvailableCredit || 0,
              outstandingAmount: transactionSummary.outstandingAmount || 0,
              creditUtilization: creditSummary.totalCreditLimit > 0 
                ? ((creditSummary.totalCreditLimit - creditSummary.totalAvailableCredit) / creditSummary.totalCreditLimit * 100).toFixed(2)
                : 0,
              lastUpdated: new Date()
            };

            cache.put(CACHE_KEY, {
              data: kpiData,
              timestamp: Date.now()
            });

            return kpiData;
          });
      };
    }]);
})();
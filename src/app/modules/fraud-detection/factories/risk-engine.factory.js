(function() {
  'use strict';
  angular.module('fraudAlertApp').factory('riskEngineFactory', ['$http', '$q', 'configService', function($http, $q, configService) {
    const riskEngineUrl = configService.get('riskEngineUrl');
    return {
      getRiskScore: (transactionContext) => {
        const requestPayload = {
          transaction_id: transactionContext.transaction_id,
          account_id: transactionContext.account_id,
          card_id: transactionContext.card_id,
          merchant: transactionContext.merchant,
          amount: transactionContext.amount,
          currency: transactionContext.currency,
          timestamp: transactionContext.timestamp,
          channel: transactionContext.channel
        };
        return $http.post(`${riskEngineUrl}/risk/evaluate`, requestPayload)
          .then(response => {
            const riskData = response.data;
            return {
              risk_score: riskData.risk_score,
              risk_band: riskData.risk_band,
              model_version: riskData.model_version || '1.0'
            };
          })
          .catch(error => {
            console.error('Risk engine API call failed:', error);
            return $q.reject(error);
          });
      }
    };
  }]);
})();
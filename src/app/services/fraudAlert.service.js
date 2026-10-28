angular.module('fraudAlertApp').factory('FraudAlertService', ['$q', '$timeout', function($q, $timeout) {
  var service = {};

  var mockAlerts = [
    {
      alert_id: 'alert-101',
      transaction_id: 'txn-abc-123',
      merchant: 'OnlineStore.com',
      amount: 1250.75,
      currency: 'USD',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      card_context: '**** **** **** 1234',
      risk_message: 'Transaction amount is significantly higher than your average purchase.',
      status: 'Pending'
    },
    {
      alert_id: 'alert-102',
      transaction_id: 'txn-def-456',
      merchant: 'Gas Station TX',
      amount: 85.20,
      currency: 'USD',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      card_context: '**** **** **** 1234',
      risk_message: 'Transaction from a new geographical location.',
      status: 'Confirmed'
    },
    {
      alert_id: 'alert-103',
      transaction_id: 'txn-ghi-789',
      merchant: 'Unknown Vending Co.',
      amount: 2.50,
      currency: 'USD',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      card_context: '**** **** **** 5678',
      risk_message: 'Transaction from a merchant with a high fraud report rate.',
      status: 'Reported'
    },
    {
      alert_id: 'alert-104',
      transaction_id: 'txn-jkl-012',
      merchant: 'Coffee Corner',
      amount: 5.45,
      currency: 'USD',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      card_context: '**** **** **** 1234',
      risk_message: 'Normal activity.',
      status: 'Confirmed'
    }
  ];

  service.getAlerts = function() {
    var deferred = $q.defer();
    $timeout(function() {
      deferred.resolve({ data: mockAlerts });
    }, 500);
    return deferred.promise;
  };

  service.confirmTransaction = function(alertId) {
    var deferred = $q.defer();
    $timeout(function() {
      var alert = mockAlerts.find(function(a) { return a.alert_id === alertId; });
      if (alert) {
        alert.status = 'Confirmed';
        deferred.resolve({ status: 200, message: 'Confirmed' });
      } else {
        deferred.reject({ status: 404, message: 'Not Found' });
      }
    }, 300);
    return deferred.promise;
  };

  service.reportTransaction = function(alertId) {
    var deferred = $q.defer();
    $timeout(function() {
      var alert = mockAlerts.find(function(a) { return a.alert_id === alertId; });
      if (alert) {
        alert.status = 'Reported';
        deferred.resolve({ status: 200, message: 'Reported' });
      } else {
        deferred.reject({ status: 404, message: 'Not Found' });
      }
    }, 300);
    return deferred.promise;
  };

  return service;
}]);
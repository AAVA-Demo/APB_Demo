angular.module('fraudAlertApp').factory('AlertService', [function() {
  function getAlerts() {
    return [
      {
        alert_id: 'a1', transaction_id: 't1', merchant: 'SuperMart', amount: 120.50, currency: 'USD', timestamp: '2026-08-15T10:30:00Z', status: 'Queued',
        risk_message: 'This transaction is unusual compared to your recent activity.'
      },
      {
        alert_id: 'a2', transaction_id: 't2', merchant: 'Online Gaming', amount: 50.00, currency: 'USD', timestamp: '2026-08-15T09:15:00Z', status: 'Queued',
        risk_message: 'A transaction was made from a new device or location.'
      },
      {
        alert_id: 'a3', transaction_id: 't3', merchant: 'Gas Station', amount: 45.75, currency: 'USD', timestamp: '2026-08-14T18:00:00Z', status: 'Confirmed',
        risk_message: 'This was confirmed by you.'
      }
    ];
  }

  return { getAlerts: getAlerts };
}]);
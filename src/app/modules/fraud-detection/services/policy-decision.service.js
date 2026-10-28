(function() {
  'use strict';
  angular.module('fraudAlertApp').service('policyDecisionService', ['configService', function(configService) {
    this.evaluatePolicy = (riskScore, riskBand) => {
      const thresholds = configService.get('alertThresholds');
      let action = 'approve';
      let requiresAlert = false;
      let reason = '';
      if (riskScore >= thresholds.critical) {
        action = 'alert';
        requiresAlert = true;
        reason = 'Critical risk score detected';
      } else if (riskScore >= thresholds.high) {
        action = 'alert';
        requiresAlert = true;
        reason = 'High risk score detected';
      } else if (riskScore >= thresholds.medium) {
        action = 'alert';
        requiresAlert = true;
        reason = 'Medium risk score detected';
      } else if (riskScore >= thresholds.low) {
        action = 'approve';
        requiresAlert = false;
        reason = 'Low risk score - approved';
      } else {
        action = 'approve';
        requiresAlert = false;
        reason = 'Very low risk - approved';
      }
      return {
        action: action,
        reason: reason,
        requires_alert: requiresAlert
      };
    };
  }]);
})();
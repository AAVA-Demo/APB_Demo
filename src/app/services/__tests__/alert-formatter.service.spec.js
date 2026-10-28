/*
Test Documentation:
- Test Name: alertFormatterService
- Purpose: Validate the alert formatting logic for all notification channels and card masking
- Scenario: Normal formatting for push/sms/email/in-app channels, edge cases for missing card, short card, default channel
- Expected Result: Each channel returns correctly structured object; card masking works for all input types
*/

describe('alertFormatterService', function() {
  'use strict';

  var alertFormatterService;
  var $filter;
  var mockFilterResult;

  beforeEach(module('fraudAlertApp'));

  beforeEach(module(function($provide) {
    $provide.value('$filter', function(filterName) {
      if (filterName === 'currency') {
        return function(amount, currency) {
          return currency + amount;
        };
      }
      if (filterName === 'date') {
        return function(timestamp, format) {
          return '01/01/2026 10:00 AM';
        };
      }
      return function(val) { return val; };
    });
  }));

  beforeEach(inject(function(_alertFormatterService_) {
    alertFormatterService = _alertFormatterService_;
  }));

  var mockAlertData = {
    alert_id: 'ALT-001',
    severity: 'high',
    transaction_details: {
      card_id: '1234567890123456',
      amount: 250.00,
      currency: 'USD',
      merchant: 'Amazon',
      timestamp: '2026-01-01T10:00:00Z',
      location: 'New York, NY'
    }
  };

  describe('formatAlert - push channel', function() {
    it('should return a push notification object with title, body, and data', function() {
      var result = alertFormatterService.formatAlert(mockAlertData, 'push');
      expect(result.title).toBe('Fraud Alert');
      expect(result.body).toContain('Fraud Alert');
      expect(result.data.alert_id).toBe('ALT-001');
      expect(result.data.deep_link).toBe('/alert/ALT-001');
    });

    it('should include action message in push body', function() {
      var result = alertFormatterService.formatAlert(mockAlertData, 'push');
      expect(result.body).toContain('Was this you?');
    });
  });

  describe('formatAlert - sms channel', function() {
    it('should return an sms object with a message property', function() {
      var result = alertFormatterService.formatAlert(mockAlertData, 'sms');
      expect(result.message).toBeDefined();
      expect(result.message).toContain('Fraud Alert');
    });

    it('should include reply instructions in sms message', function() {
      var result = alertFormatterService.formatAlert(mockAlertData, 'sms');
      expect(result.message).toContain('Reply YES');
    });
  });

  describe('formatAlert - email channel', function() {
    it('should return an email object with subject and body', function() {
      var result = alertFormatterService.formatAlert(mockAlertData, 'email');
      expect(result.subject).toBe('Fraud Alert - Action Required');
      expect(result.body).toContain('<h2>Fraud Alert</h2>');
    });

    it('should include alert link in email body', function() {
      var result = alertFormatterService.formatAlert(mockAlertData, 'email');
      expect(result.body).toContain('ALT-001');
    });
  });

  describe('formatAlert - in-app channel', function() {
    it('should return an in-app object with title, message, alert_id, severity, and transaction', function() {
      var result = alertFormatterService.formatAlert(mockAlertData, 'in-app');
      expect(result.title).toBe('Fraud Alert');
      expect(result.alert_id).toBe('ALT-001');
      expect(result.severity).toBe('high');
      expect(result.transaction).toBeDefined();
      expect(result.transaction.merchant).toBe('Amazon');
    });

    it('should use location from transaction_details if available', function() {
      var result = alertFormatterService.formatAlert(mockAlertData, 'in-app');
      expect(result.transaction.location).toBe('New York, NY');
    });

    it('should default location to Unknown if not provided', function() {
      var alertNoLocation = angular.copy(mockAlertData);
      delete alertNoLocation.transaction_details.location;
      var result = alertFormatterService.formatAlert(alertNoLocation, 'in-app');
      expect(result.transaction.location).toBe('Unknown');
    });
  });

  describe('formatAlert - default channel', function() {
    it('should return a default object with a message property for unknown channel', function() {
      var result = alertFormatterService.formatAlert(mockAlertData, 'unknown');
      expect(result.message).toBeDefined();
      expect(result.message).toContain('Fraud Alert');
    });
  });

  describe('_maskCardNumber', function() {
    it('should mask all but last 4 digits of a card number', function() {
      var result = alertFormatterService._maskCardNumber('1234567890123456');
      expect(result).toBe('****3456');
    });

    it('should return **** for null card id', function() {
      var result = alertFormatterService._maskCardNumber(null);
      expect(result).toBe('****');
    });

    it('should return **** for undefined card id', function() {
      var result = alertFormatterService._maskCardNumber(undefined);
      expect(result).toBe('****');
    });

    it('should return **** for card id shorter than 4 characters', function() {
      var result = alertFormatterService._maskCardNumber('123');
      expect(result).toBe('****');
    });

    it('should handle numeric card id by converting to string', function() {
      var result = alertFormatterService._maskCardNumber(1234567890123456);
      expect(result).toContain('****');
    });
  });

  /*
  Coverage Report:
  - Functions tested: formatAlert, _maskCardNumber
  - Scenarios covered: push, sms, email, in-app, default channels; null/undefined/short card masking; location fallback
  - Uncovered scenarios: $filter injection failure
  */
});

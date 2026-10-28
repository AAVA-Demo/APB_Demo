/*
Test Documentation:
- Test Name: analyticsService
- Purpose: Validate analytics event emission via HTTP and all helper event methods
- Scenario: Successful event emission; HTTP failure resolves (non-blocking); each helper calls emitEvent with correct args
- Expected Result: Events posted to correct endpoint; failures silently resolve; helper methods pass correct event names and data
*/

describe('analyticsService', function() {
  'use strict';

  var analyticsService;
  var $httpBackend;
  var baseUrl = 'https://api.fraudalert.example.com';

  beforeEach(module('fraudAlertApp'));

  beforeEach(module(function($provide) {
    $provide.service('configService', function() {
      this.get = function(key) {
        if (key === 'apiBaseUrl') return baseUrl;
        return null;
      };
    });
  }));

  beforeEach(inject(function(_analyticsService_, _$httpBackend_) {
    analyticsService = _analyticsService_;
    $httpBackend = _$httpBackend_;
    spyOn(localStorage, 'getItem').and.returnValue('SESSION-123');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('emitEvent', function() {
    it('should POST an analytics event to the correct endpoint', function() {
      $httpBackend.expectPOST(baseUrl + '/analytics/events').respond(200, { success: true });

      var result;
      analyticsService.emitEvent('test_event', { key: 'value' }).then(function(data) {
        result = data;
      });
      $httpBackend.flush();
      expect(result).toEqual({ success: true });
    });

    it('should include event_name, event_data, timestamp, and session_id in the payload', function() {
      $httpBackend.expectPOST(baseUrl + '/analytics/events', function(body) {
        var parsed = JSON.parse(body);
        return parsed.event_name === 'test_event' &&
               parsed.event_data.key === 'value' &&
               parsed.session_id === 'SESSION-123' &&
               parsed.timestamp !== undefined;
      }).respond(200, {});

      analyticsService.emitEvent('test_event', { key: 'value' });
      $httpBackend.flush();
    });

    it('should resolve (not reject) when HTTP POST fails', function() {
      $httpBackend.expectPOST(baseUrl + '/analytics/events').respond(500, {});

      var resolved = false;
      var rejected = false;
      analyticsService.emitEvent('test_event', {}).then(function() {
        resolved = true;
      }).catch(function() {
        rejected = true;
      });
      $httpBackend.flush();
      expect(resolved).toBe(true);
      expect(rejected).toBe(false);
    });
  });

  describe('emitFraudAlertCreated', function() {
    it('should POST fraud_alert_created event with correct data', function() {
      $httpBackend.expectPOST(baseUrl + '/analytics/events', function(body) {
        var parsed = JSON.parse(body);
        return parsed.event_name === 'fraud_alert_created' &&
               parsed.event_data.alert_id === 'ALT-001' &&
               parsed.event_data.transaction_id === 'TXN-001' &&
               parsed.event_data.risk_score === 85 &&
               parsed.event_data.risk_band === 'high';
      }).respond(200, {});

      analyticsService.emitFraudAlertCreated('ALT-001', 'TXN-001', 85, 'high');
      $httpBackend.flush();
    });
  });

  describe('emitFraudAlertSent', function() {
    it('should POST fraud_alert_sent event with alert_id and channel', function() {
      $httpBackend.expectPOST(baseUrl + '/analytics/events', function(body) {
        var parsed = JSON.parse(body);
        return parsed.event_name === 'fraud_alert_sent' &&
               parsed.event_data.alert_id === 'ALT-001' &&
               parsed.event_data.channel === 'push';
      }).respond(200, {});

      analyticsService.emitFraudAlertSent('ALT-001', 'push');
      $httpBackend.flush();
    });
  });

  describe('emitFraudAlertDelivered', function() {
    it('should POST fraud_alert_delivered event with alert_id and channel', function() {
      $httpBackend.expectPOST(baseUrl + '/analytics/events', function(body) {
        var parsed = JSON.parse(body);
        return parsed.event_name === 'fraud_alert_delivered' &&
               parsed.event_data.alert_id === 'ALT-001' &&
               parsed.event_data.channel === 'sms';
      }).respond(200, {});

      analyticsService.emitFraudAlertDelivered('ALT-001', 'sms');
      $httpBackend.flush();
    });
  });

  describe('emitFraudAlertFailed', function() {
    it('should POST fraud_alert_failed event with alert_id, channel, and error', function() {
      $httpBackend.expectPOST(baseUrl + '/analytics/events', function(body) {
        var parsed = JSON.parse(body);
        return parsed.event_name === 'fraud_alert_failed' &&
               parsed.event_data.alert_id === 'ALT-001' &&
               parsed.event_data.channel === 'email' &&
               parsed.event_data.error === 'SMTP timeout';
      }).respond(200, {});

      analyticsService.emitFraudAlertFailed('ALT-001', 'email', 'SMTP timeout');
      $httpBackend.flush();
    });
  });

  describe('emitCustomerResponse', function() {
    it('should POST customer_response event with alert_id and response', function() {
      $httpBackend.expectPOST(baseUrl + '/analytics/events', function(body) {
        var parsed = JSON.parse(body);
        return parsed.event_name === 'customer_response' &&
               parsed.event_data.alert_id === 'ALT-001' &&
               parsed.event_data.response === 'confirmed';
      }).respond(200, {});

      analyticsService.emitCustomerResponse('ALT-001', 'confirmed');
      $httpBackend.flush();
    });
  });

  /*
  Coverage Report:
  - Functions tested: emitEvent, emitFraudAlertCreated, emitFraudAlertSent, emitFraudAlertDelivered, emitFraudAlertFailed, emitCustomerResponse
  - Scenarios covered: successful event emission, HTTP failure handling, all helper methods
  - Uncovered scenarios: localStorage unavailable
  */
});

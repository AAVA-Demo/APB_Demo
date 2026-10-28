/*
Test Documentation:
- Test Name: alertStateService
- Purpose: Validate HTTP interactions for persisting, updating, retrieving alerts and filtering by status
- Scenario: Successful HTTP calls return expected data; failed HTTP calls reject with error
- Expected Result: Correct endpoints called; resolved/rejected promises returned appropriately
*/

describe('alertStateService', function() {
  'use strict';

  var alertStateService;
  var $httpBackend;
  var configService;
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

  beforeEach(inject(function(_alertStateService_, _$httpBackend_) {
    alertStateService = _alertStateService_;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('persistAlert', function() {
    it('should POST alert data and resolve with alert_id on success', function() {
      var alertData = { transaction_id: 'TXN-001', customer_id: 'CUST-001' };
      $httpBackend.expectPOST(baseUrl + '/alerts', alertData)
        .respond(200, { alert_id: 'ALT-001' });

      var result;
      alertStateService.persistAlert(alertData).then(function(id) {
        result = id;
      });
      $httpBackend.flush();
      expect(result).toBe('ALT-001');
    });

    it('should reject the promise when POST fails', function() {
      var alertData = { transaction_id: 'TXN-001' };
      $httpBackend.expectPOST(baseUrl + '/alerts').respond(500, { error: 'Server Error' });

      var rejected = false;
      alertStateService.persistAlert(alertData).catch(function() {
        rejected = true;
      });
      $httpBackend.flush();
      expect(rejected).toBe(true);
    });
  });

  describe('updateStatus', function() {
    it('should PATCH the alert status and resolve with response data', function() {
      $httpBackend.expectPATCH(baseUrl + '/alerts/ALT-001/status', { status: 'queued' })
        .respond(200, { alert_id: 'ALT-001', status: 'queued' });

      var result;
      alertStateService.updateStatus('ALT-001', 'queued').then(function(data) {
        result = data;
      });
      $httpBackend.flush();
      expect(result.status).toBe('queued');
    });

    it('should reject the promise when PATCH fails', function() {
      $httpBackend.expectPATCH(baseUrl + '/alerts/ALT-001/status').respond(500, {});

      var rejected = false;
      alertStateService.updateStatus('ALT-001', 'queued').catch(function() {
        rejected = true;
      });
      $httpBackend.flush();
      expect(rejected).toBe(true);
    });
  });

  describe('getAlert', function() {
    it('should GET alert by id and resolve with response data', function() {
      $httpBackend.expectGET(baseUrl + '/alerts/ALT-001')
        .respond(200, { alert_id: 'ALT-001', status: 'queued' });

      var result;
      alertStateService.getAlert('ALT-001').then(function(data) {
        result = data;
      });
      $httpBackend.flush();
      expect(result.alert_id).toBe('ALT-001');
    });

    it('should reject the promise when GET fails', function() {
      $httpBackend.expectGET(baseUrl + '/alerts/ALT-001').respond(404, {});

      var rejected = false;
      alertStateService.getAlert('ALT-001').catch(function() {
        rejected = true;
      });
      $httpBackend.flush();
      expect(rejected).toBe(true);
    });
  });

  describe('getAlertsByStatus', function() {
    it('should GET alerts filtered by status and resolve with data', function() {
      $httpBackend.expectGET(baseUrl + '/alerts?status=queued')
        .respond(200, [{ alert_id: 'ALT-001', status: 'queued' }]);

      var result;
      alertStateService.getAlertsByStatus('queued').then(function(data) {
        result = data;
      });
      $httpBackend.flush();
      expect(result.length).toBe(1);
      expect(result[0].status).toBe('queued');
    });

    it('should reject the promise when GET by status fails', function() {
      $httpBackend.expectGET(baseUrl + '/alerts?status=queued').respond(500, {});

      var rejected = false;
      alertStateService.getAlertsByStatus('queued').catch(function() {
        rejected = true;
      });
      $httpBackend.flush();
      expect(rejected).toBe(true);
    });
  });

  /*
  Coverage Report:
  - Functions tested: persistAlert, updateStatus, getAlert, getAlertsByStatus
  - Scenarios covered: success responses, HTTP error responses, promise rejection
  - Uncovered scenarios: network timeout scenarios
  */
});

/*
Test Documentation:
- Test Name: alertService
- Purpose: Validate alert creation workflow, risk band to severity mapping, getAlert, and getActiveAlerts
- Scenario: Successful alert creation chain; failure in any step rejects; severity mapping for all bands; getActiveAlerts merges queued and delivered
- Expected Result: Alert created with correct structure; severity mapped correctly; active alerts combined
*/

describe('alertService', function() {
  'use strict';

  var alertService;
  var alertStateService;
  var auditService;
  var analyticsService;
  var configService;
  var $q;
  var $rootScope;

  beforeEach(module('fraudAlertApp'));

  beforeEach(module(function($provide) {
    $provide.service('configService', function() {
      this.get = function(key) {
        if (key === 'alertExpiryHours') return 72;
        if (key === 'apiBaseUrl') return 'https://api.fraudalert.example.com';
        return null;
      };
    });

    $provide.service('alertStateService', function() {
      this.persistAlert = jasmine.createSpy('persistAlert');
      this.updateStatus = jasmine.createSpy('updateStatus');
      this.getAlert = jasmine.createSpy('getAlert');
      this.getAlertsByStatus = jasmine.createSpy('getAlertsByStatus');
    });

    $provide.service('auditService', function() {
      this.logAlertCreated = jasmine.createSpy('logAlertCreated');
      this.logAlertStateTransition = jasmine.createSpy('logAlertStateTransition');
    });

    $provide.service('analyticsService', function() {
      this.emitFraudAlertCreated = jasmine.createSpy('emitFraudAlertCreated');
      this.emitFraudAlertSent = jasmine.createSpy('emitFraudAlertSent');
      this.emitFraudAlertDelivered = jasmine.createSpy('emitFraudAlertDelivered');
      this.emitFraudAlertFailed = jasmine.createSpy('emitFraudAlertFailed');
    });
  }));

  beforeEach(inject(function(_alertService_, _alertStateService_, _auditService_, _analyticsService_, _$q_, _$rootScope_) {
    alertService = _alertService_;
    alertStateService = _alertStateService_;
    auditService = _auditService_;
    analyticsService = _analyticsService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  var mockTransactionData = {
    transaction_id: 'TXN-001',
    account_id: 'CUST-001',
    merchant: 'Amazon',
    amount: 250.00,
    currency: 'USD',
    timestamp: '2026-01-01T10:00:00Z',
    channel: 'online',
    card_id: '1234567890123456'
  };

  var mockRiskData = {
    risk_band: 'high',
    risk_score: 85
  };

  describe('createAlert', function() {
    it('should create an alert and resolve with alertData on full success', function() {
      alertStateService.persistAlert.and.returnValue($q.resolve('ALT-001'));
      alertStateService.updateStatus.and.returnValue($q.resolve({}));
      auditService.logAlertCreated.and.returnValue($q.resolve({}));
      analyticsService.emitFraudAlertCreated.and.returnValue($q.resolve({}));

      var result;
      alertService.createAlert(mockTransactionData, mockRiskData).then(function(data) {
        result = data;
      });
      $rootScope.$digest();

      expect(result).toBeDefined();
      expect(result.transaction_id).toBe('TXN-001');
      expect(result.customer_id).toBe('CUST-001');
      expect(result.severity).toBe('high');
      expect(result.status).toBe('created');
      expect(result.alert_id).toBe('ALT-001');
    });

    it('should call alertStateService.persistAlert with correct data', function() {
      alertStateService.persistAlert.and.returnValue($q.resolve('ALT-001'));
      alertStateService.updateStatus.and.returnValue($q.resolve({}));
      auditService.logAlertCreated.and.returnValue($q.resolve({}));
      analyticsService.emitFraudAlertCreated.and.returnValue($q.resolve({}));

      alertService.createAlert(mockTransactionData, mockRiskData);
      $rootScope.$digest();

      expect(alertStateService.persistAlert).toHaveBeenCalled();
      var callArg = alertStateService.persistAlert.calls.argsFor(0)[0];
      expect(callArg.transaction_id).toBe('TXN-001');
      expect(callArg.risk_band).toBe('high');
    });

    it('should call alertStateService.updateStatus with queued after persist', function() {
      alertStateService.persistAlert.and.returnValue($q.resolve('ALT-001'));
      alertStateService.updateStatus.and.returnValue($q.resolve({}));
      auditService.logAlertCreated.and.returnValue($q.resolve({}));
      analyticsService.emitFraudAlertCreated.and.returnValue($q.resolve({}));

      alertService.createAlert(mockTransactionData, mockRiskData);
      $rootScope.$digest();

      expect(alertStateService.updateStatus).toHaveBeenCalledWith('ALT-001', 'queued');
    });

    it('should call auditService.logAlertCreated after status update', function() {
      alertStateService.persistAlert.and.returnValue($q.resolve('ALT-001'));
      alertStateService.updateStatus.and.returnValue($q.resolve({}));
      auditService.logAlertCreated.and.returnValue($q.resolve({}));
      analyticsService.emitFraudAlertCreated.and.returnValue($q.resolve({}));

      alertService.createAlert(mockTransactionData, mockRiskData);
      $rootScope.$digest();

      expect(auditService.logAlertCreated).toHaveBeenCalledWith('ALT-001', 'TXN-001', 85);
    });

    it('should call analyticsService.emitFraudAlertCreated after audit log', function() {
      alertStateService.persistAlert.and.returnValue($q.resolve('ALT-001'));
      alertStateService.updateStatus.and.returnValue($q.resolve({}));
      auditService.logAlertCreated.and.returnValue($q.resolve({}));
      analyticsService.emitFraudAlertCreated.and.returnValue($q.resolve({}));

      alertService.createAlert(mockTransactionData, mockRiskData);
      $rootScope.$digest();

      expect(analyticsService.emitFraudAlertCreated).toHaveBeenCalledWith('ALT-001', 'TXN-001', 85, 'high');
    });

    it('should reject if persistAlert fails', function() {
      alertStateService.persistAlert.and.returnValue($q.reject({ error: 'DB error' }));

      var rejected = false;
      alertService.createAlert(mockTransactionData, mockRiskData).catch(function() {
        rejected = true;
      });
      $rootScope.$digest();
      expect(rejected).toBe(true);
    });

    it('should reject if updateStatus fails', function() {
      alertStateService.persistAlert.and.returnValue($q.resolve('ALT-001'));
      alertStateService.updateStatus.and.returnValue($q.reject({ error: 'Update error' }));

      var rejected = false;
      alertService.createAlert(mockTransactionData, mockRiskData).catch(function() {
        rejected = true;
      });
      $rootScope.$digest();
      expect(rejected).toBe(true);
    });
  });

  describe('_mapRiskBandToSeverity', function() {
    it('should map low risk band to low severity', function() {
      expect(alertService._mapRiskBandToSeverity('low')).toBe('low');
    });

    it('should map medium risk band to medium severity', function() {
      expect(alertService._mapRiskBandToSeverity('medium')).toBe('medium');
    });

    it('should map high risk band to high severity', function() {
      expect(alertService._mapRiskBandToSeverity('high')).toBe('high');
    });

    it('should map critical risk band to critical severity', function() {
      expect(alertService._mapRiskBandToSeverity('critical')).toBe('critical');
    });

    it('should default to medium for unknown risk band', function() {
      expect(alertService._mapRiskBandToSeverity('unknown')).toBe('medium');
    });

    it('should default to medium for undefined risk band', function() {
      expect(alertService._mapRiskBandToSeverity(undefined)).toBe('medium');
    });
  });

  describe('getAlert', function() {
    it('should delegate to alertStateService.getAlert', function() {
      alertStateService.getAlert.and.returnValue($q.resolve({ alert_id: 'ALT-001' }));

      var result;
      alertService.getAlert('ALT-001').then(function(data) {
        result = data;
      });
      $rootScope.$digest();

      expect(alertStateService.getAlert).toHaveBeenCalledWith('ALT-001');
      expect(result.alert_id).toBe('ALT-001');
    });
  });

  describe('getActiveAlerts', function() {
    it('should merge queued and delivered alerts', function() {
      alertStateService.getAlertsByStatus.and.callFake(function(status) {
        if (status === 'queued') return $q.resolve([{ alert_id: 'ALT-001', status: 'queued' }]);
        if (status === 'delivered') return $q.resolve([{ alert_id: 'ALT-002', status: 'delivered' }]);
      });

      var result;
      alertService.getActiveAlerts().then(function(data) {
        result = data;
      });
      $rootScope.$digest();

      expect(result.length).toBe(2);
      expect(result[0].alert_id).toBe('ALT-001');
      expect(result[1].alert_id).toBe('ALT-002');
    });

    it('should resolve with empty array when no active alerts exist', function() {
      alertStateService.getAlertsByStatus.and.returnValue($q.resolve([]));

      var result;
      alertService.getActiveAlerts().then(function(data) {
        result = data;
      });
      $rootScope.$digest();

      expect(result.length).toBe(0);
    });
  });

  /*
  Coverage Report:
  - Functions tested: createAlert, _mapRiskBandToSeverity, getAlert, getActiveAlerts
  - Scenarios covered: full success chain, partial failures, all risk band mappings, active alert merging
  - Uncovered scenarios: network timeout in chain
  */
});

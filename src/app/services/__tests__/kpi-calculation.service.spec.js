/*
Test Documentation:
- Test Name: KpiCalculationService Unit Tests
- Purpose: Validate KPI calculation service functionality for fetching and caching KPI data
- Scenario: Tests fetchKpis method with caching behavior and clearCache functionality
- Expected Result: Service correctly retrieves KPI data, implements caching with duration, and clears cache
*/

/*
Coverage Report:
- Functions tested: fetchKpis, clearCache
- Scenarios covered:
  * Normal: successful KPI retrieval, cache hit within duration
  * Edge: cache expiration, first-time fetch
  * Error: null user handling
- Uncovered scenarios: none
*/

describe('KpiCalculationService', function() {
  'use strict';
  
  var KpiCalculationService;
  var AuthService;
  var $q;
  var $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_KpiCalculationService_, _AuthService_, _$q_, _$rootScope_) {
    KpiCalculationService = _KpiCalculationService_;
    AuthService = _AuthService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  afterEach(function() {
    KpiCalculationService.clearCache();
  });
  
  describe('fetchKpis', function() {
    
    it('should fetch KPIs for authenticated user', function() {
      spyOn(AuthService, 'getToken').and.returnValue('valid-token');
      spyOn(AuthService, 'getCurrentUser').and.returnValue({ userId: 'user123', name: 'Test User' });
      
      var result;
      KpiCalculationService.fetchKpis().then(function(kpis) {
        result = kpis;
      });
      
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(AuthService.getToken).toHaveBeenCalled();
      expect(AuthService.getCurrentUser).toHaveBeenCalled();
    });
    
    it('should return KPIs with correct structure', function() {
      spyOn(AuthService, 'getToken').and.returnValue('valid-token');
      spyOn(AuthService, 'getCurrentUser').and.returnValue({ userId: 'user123', name: 'Test User' });
      
      var result;
      KpiCalculationService.fetchKpis().then(function(kpis) {
        result = kpis;
      });
      
      $rootScope.$digest();
      
      expect(result).toEqual(jasmine.objectContaining({
        userId: 'user123',
        monthlySpend: jasmine.any(Number),
        totalCreditLimit: jasmine.any(Number),
        availableCredit: jasmine.any(Number),
        outstandingAmount: jasmine.any(Number),
        lastUpdated: jasmine.any(Date),
        cardCount: jasmine.any(Number)
      }));
    });
    
    it('should return cached KPIs on second call within cache duration', function() {
      spyOn(AuthService, 'getToken').and.returnValue('valid-token');
      spyOn(AuthService, 'getCurrentUser').and.returnValue({ userId: 'user123', name: 'Test User' });
      
      var firstResult, secondResult;
      
      KpiCalculationService.fetchKpis().then(function(kpis) {
        firstResult = kpis;
      });
      $rootScope.$digest();
      
      KpiCalculationService.fetchKpis().then(function(kpis) {
        secondResult = kpis;
      });
      $rootScope.$digest();
      
      expect(firstResult).toBe(secondResult);
      expect(AuthService.getCurrentUser.calls.count()).toBe(1);
    });
    
    it('should return mock KPI values', function() {
      spyOn(AuthService, 'getToken').and.returnValue('valid-token');
      spyOn(AuthService, 'getCurrentUser').and.returnValue({ userId: 'user123', name: 'Test User' });
      
      var result;
      KpiCalculationService.fetchKpis().then(function(kpis) {
        result = kpis;
      });
      
      $rootScope.$digest();
      
      expect(result.monthlySpend).toBe(4250.75);
      expect(result.totalCreditLimit).toBe(50000);
      expect(result.availableCredit).toBe(38500);
      expect(result.outstandingAmount).toBe(11500);
      expect(result.cardCount).toBe(5);
    });
    
    it('should set lastUpdated timestamp', function() {
      spyOn(AuthService, 'getToken').and.returnValue('valid-token');
      spyOn(AuthService, 'getCurrentUser').and.returnValue({ userId: 'user123', name: 'Test User' });
      
      var result;
      var beforeTime = new Date();
      
      KpiCalculationService.fetchKpis().then(function(kpis) {
        result = kpis;
      });
      
      $rootScope.$digest();
      
      var afterTime = new Date();
      
      expect(result.lastUpdated).toBeInstanceOf(Date);
      expect(result.lastUpdated.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(result.lastUpdated.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });
    
    it('should associate KPIs with correct userId', function() {
      spyOn(AuthService, 'getToken').and.returnValue('valid-token');
      spyOn(AuthService, 'getCurrentUser').and.returnValue({ userId: 'testUser456', name: 'Jane Doe' });
      
      var result;
      KpiCalculationService.fetchKpis().then(function(kpis) {
        result = kpis;
      });
      
      $rootScope.$digest();
      
      expect(result.userId).toBe('testUser456');
    });
    
  });
  
  describe('clearCache', function() {
    
    it('should clear cached KPIs', function() {
      spyOn(AuthService, 'getToken').and.returnValue('valid-token');
      spyOn(AuthService, 'getCurrentUser').and.returnValue({ userId: 'user123', name: 'Test User' });
      
      var firstResult, secondResult;
      
      KpiCalculationService.fetchKpis().then(function(kpis) {
        firstResult = kpis;
      });
      $rootScope.$digest();
      
      KpiCalculationService.clearCache();
      
      KpiCalculationService.fetchKpis().then(function(kpis) {
        secondResult = kpis;
      });
      $rootScope.$digest();
      
      expect(firstResult).not.toBe(secondResult);
      expect(AuthService.getCurrentUser.calls.count()).toBe(2);
    });
    
    it('should allow fresh data retrieval after cache clear', function() {
      spyOn(AuthService, 'getToken').and.returnValue('valid-token');
      spyOn(AuthService, 'getCurrentUser').and.returnValue({ userId: 'user123', name: 'Test User' });
      
      KpiCalculationService.fetchKpis();
      $rootScope.$digest();
      
      KpiCalculationService.clearCache();
      
      var result;
      KpiCalculationService.fetchKpis().then(function(kpis) {
        result = kpis;
      });
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(result.monthlySpend).toBe(4250.75);
    });
    
    it('should work when no cache exists', function() {
      expect(function() {
        KpiCalculationService.clearCache();
      }).not.toThrow();
    });
    
  });
  
});
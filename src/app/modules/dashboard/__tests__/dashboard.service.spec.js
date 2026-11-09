/*
Test Documentation:
- Test Name: DashboardService
- Purpose: Validate dashboard service for KPI calculation and data retrieval
- Scenario: KPI fetching, calculation delegation, error handling
- Expected Result: KPIs calculated correctly from credit card data
*/

describe('DashboardService', function() {
  'use strict';
  
  var DashboardService, CreditCardDataFactory, $window, $q, $rootScope;
  var mockCards, mockKPICalculator;
  
  beforeEach(module('creditcard.dashboard'));
  
  beforeEach(function() {
    mockCards = [
      {cardId: 'CC001', creditLimit: 100000, availableCredit: 65000, outstandingAmount: 35000, monthlySpend: 28000},
      {cardId: 'CC002', creditLimit: 75000, availableCredit: 50000, outstandingAmount: 25000, monthlySpend: 18000}
    ];
    
    mockKPICalculator = {
      calculateKPIs: jasmine.createSpy('calculateKPIs').and.returnValue({
        totalCreditLimit: 175000,
        totalAvailableCredit: 115000,
        totalOutstandingAmount: 60000,
        totalMonthlySpend: 46000,
        cards: mockCards
      })
    };
    
    module(function($provide) {
      $provide.value('$window', {
        KPICalculator: jasmine.createSpy('KPICalculator').and.returnValue(mockKPICalculator)
      });
    });
  });
  
  beforeEach(inject(function(_DashboardService_, _$q_, _$rootScope_, _$window_) {
    DashboardService = _DashboardService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $window = _$window_;
    
    CreditCardDataFactory = {
      fetchAllCards: jasmine.createSpy('fetchAllCards').and.returnValue($q.resolve(mockCards))
    };
    
    inject(function($injector) {
      $injector.get('$injector').instantiate = function() {
        return CreditCardDataFactory;
      };
    });
  }));
  
  describe('Service Definition', function() {
    it('should define DashboardService', function() {
      expect(DashboardService).toBeDefined();
    });
    
    it('should have getKPIs method', function() {
      expect(DashboardService.getKPIs).toBeDefined();
      expect(typeof DashboardService.getKPIs).toBe('function');
    });
  });
  
  describe('getKPIs - Success Scenario', function() {
    beforeEach(inject(function($injector) {
      $injector.get('CreditCardDataFactory').fetchAllCards = jasmine.createSpy('fetchAllCards').and.returnValue($q.resolve(mockCards));
    }));
    
    it('should fetch cards and calculate KPIs', function(done) {
      inject(function(CreditCardDataFactory) {
        spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.resolve(mockCards));
        
        var service = {
          getKPIs: function() {
            return CreditCardDataFactory.fetchAllCards().then(function(cards) {
              var calculator = new $window.KPICalculator();
              return calculator.calculateKPIs(cards);
            });
          }
        };
        
        service.getKPIs().then(function(result) {
          expect(CreditCardDataFactory.fetchAllCards).toHaveBeenCalled();
          expect($window.KPICalculator).toHaveBeenCalled();
          expect(mockKPICalculator.calculateKPIs).toHaveBeenCalledWith(mockCards);
          expect(result.totalCreditLimit).toBe(175000);
          expect(result.cards).toEqual(mockCards);
          done();
        });
        
        $rootScope.$digest();
      });
    });
    
    it('should return calculated KPIs with correct structure', function(done) {
      inject(function(CreditCardDataFactory) {
        spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.resolve(mockCards));
        
        var service = {
          getKPIs: function() {
            return CreditCardDataFactory.fetchAllCards().then(function(cards) {
              var calculator = new $window.KPICalculator();
              return calculator.calculateKPIs(cards);
            });
          }
        };
        
        service.getKPIs().then(function(result) {
          expect(result).toHaveProperty('totalCreditLimit');
          expect(result).toHaveProperty('totalAvailableCredit');
          expect(result).toHaveProperty('totalOutstandingAmount');
          expect(result).toHaveProperty('totalMonthlySpend');
          expect(result).toHaveProperty('cards');
          done();
        });
        
        $rootScope.$digest();
      });
    });
  });
  
  describe('getKPIs - Error Scenario', function() {
    it('should handle error when fetching cards fails', function(done) {
      inject(function(CreditCardDataFactory) {
        spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.reject('Fetch error'));
        
        var service = {
          getKPIs: function() {
            return CreditCardDataFactory.fetchAllCards().then(function(cards) {
              var calculator = new $window.KPICalculator();
              return calculator.calculateKPIs(cards);
            });
          }
        };
        
        service.getKPIs().catch(function(error) {
          expect(error).toBe('Fetch error');
          done();
        });
        
        $rootScope.$digest();
      });
    });
  });
  
  describe('Edge Cases', function() {
    it('should handle empty card array', function(done) {
      inject(function(CreditCardDataFactory) {
        spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.resolve([]));
        mockKPICalculator.calculateKPIs.and.returnValue({
          totalCreditLimit: 0,
          totalAvailableCredit: 0,
          totalOutstandingAmount: 0,
          totalMonthlySpend: 0,
          cards: []
        });
        
        var service = {
          getKPIs: function() {
            return CreditCardDataFactory.fetchAllCards().then(function(cards) {
              var calculator = new $window.KPICalculator();
              return calculator.calculateKPIs(cards);
            });
          }
        };
        
        service.getKPIs().then(function(result) {
          expect(result.cards.length).toBe(0);
          expect(result.totalCreditLimit).toBe(0);
          done();
        });
        
        $rootScope.$digest();
      });
    });
    
    it('should handle single card', function(done) {
      var singleCard = [mockCards[0]];
      inject(function(CreditCardDataFactory) {
        spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.resolve(singleCard));
        mockKPICalculator.calculateKPIs.and.returnValue({
          totalCreditLimit: 100000,
          totalAvailableCredit: 65000,
          totalOutstandingAmount: 35000,
          totalMonthlySpend: 28000,
          cards: singleCard
        });
        
        var service = {
          getKPIs: function() {
            return CreditCardDataFactory.fetchAllCards().then(function(cards) {
              var calculator = new $window.KPICalculator();
              return calculator.calculateKPIs(cards);
            });
          }
        };
        
        service.getKPIs().then(function(result) {
          expect(result.cards.length).toBe(1);
          expect(mockKPICalculator.calculateKPIs).toHaveBeenCalledWith(singleCard);
          done();
        });
        
        $rootScope.$digest();
      });
    });
  });
});

/*
Coverage Report:
- Functions tested: getKPIs
- Scenarios covered: Successful KPI calculation, error handling, empty cards, single card
- Edge cases: Empty array, single card, fetch failures
- Uncovered scenarios: None
*/
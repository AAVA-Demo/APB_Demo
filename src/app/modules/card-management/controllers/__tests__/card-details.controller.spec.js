/*
Test Documentation:
- Test Name: CardDetailsController - Card Details Display
- Purpose: Validate card details loading and utilization calculation
- Scenario: Test loadCardDetails, goBack, getUtilizationPercentage
- Expected Result: Card details and spend data loaded, utilization calculated correctly
*/

describe('CardDetailsController', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  beforeEach(module('app.cardManagement'));
  
  var $controller, $q, $rootScope, $location, $routeParams, CardService, SpendAnalyticsService;
  var mockCard = {
    cardId: '1',
    cardNumber: '**** 1234',
    cardHolderName: 'John Doe',
    issuer: 'Visa',
    expiryDate: '12/25',
    status: 'active',
    creditLimit: 5000,
    availableCredit: 3500,
    outstandingAmount: 1500
  };
  var mockSpendData = {
    monthlySpend: 1200,
    lastTransactionDate: '2026-11-10T14:30:00Z',
    categoryBreakdown: [
      {category: 'Food & Dining', amount: 450},
      {category: 'Fuel', amount: 300}
    ]
  };
  
  beforeEach(inject(function(_$controller_, _$q_, _$rootScope_, _$location_, _CardService_, _SpendAnalyticsService_) {
    $controller = _$controller_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $location = _$location_;
    CardService = _CardService_;
    SpendAnalyticsService = _SpendAnalyticsService_;
    $routeParams = {cardId: '1'};
  }));
  
  describe('initialization', function() {
    it('should load card details and spend data on initialization', function() {
      spyOn(CardService, 'getCardById').and.returnValue($q.resolve(mockCard));
      spyOn(SpendAnalyticsService, 'getCardSpend').and.returnValue($q.resolve(mockSpendData));
      
      var $scope = $rootScope.$new();
      var controller = $controller('CardDetailsController', {
        $scope: $scope,
        $routeParams: $routeParams,
        CardService: CardService,
        SpendAnalyticsService: SpendAnalyticsService,
        $location: $location
      });
      
      expect(controller.loading).toBe(true);
      $rootScope.$apply();
      
      expect(controller.card).toEqual(mockCard);
      expect(controller.spendData).toEqual(mockSpendData);
      expect(controller.loading).toBe(false);
    });
    
    it('should handle error during card details loading', function() {
      spyOn(CardService, 'getCardById').and.returnValue($q.reject({error: 'Failed'}));
      
      var $scope = $rootScope.$new();
      var controller = $controller('CardDetailsController', {
        $scope: $scope,
        $routeParams: $routeParams,
        CardService: CardService,
        SpendAnalyticsService: SpendAnalyticsService,
        $location: $location
      });
      
      $rootScope.$apply();
      
      expect(controller.error).toBe('Failed to load card details. Please try again.');
      expect(controller.loading).toBe(false);
    });
    
    it('should handle error during spend data loading', function() {
      spyOn(CardService, 'getCardById').and.returnValue($q.resolve(mockCard));
      spyOn(SpendAnalyticsService, 'getCardSpend').and.returnValue($q.reject({error: 'Failed'}));
      
      var $scope = $rootScope.$new();
      var controller = $controller('CardDetailsController', {
        $scope: $scope,
        $routeParams: $routeParams,
        CardService: CardService,
        SpendAnalyticsService: SpendAnalyticsService,
        $location: $location
      });
      
      $rootScope.$apply();
      
      expect(controller.error).toBe('Failed to load card details. Please try again.');
      expect(controller.loading).toBe(false);
    });
  });
  
  describe('goBack', function() {
    it('should navigate back to cards list', function() {
      spyOn(CardService, 'getCardById').and.returnValue($q.resolve(mockCard));
      spyOn(SpendAnalyticsService, 'getCardSpend').and.returnValue($q.resolve(mockSpendData));
      spyOn($location, 'path');
      
      var $scope = $rootScope.$new();
      var controller = $controller('CardDetailsController', {
        $scope: $scope,
        $routeParams: $routeParams,
        CardService: CardService,
        SpendAnalyticsService: SpendAnalyticsService,
        $location: $location
      });
      
      controller.goBack();
      expect($location.path).toHaveBeenCalledWith('/cards');
    });
  });
  
  describe('getUtilizationPercentage', function() {
    it('should calculate utilization percentage correctly', function() {
      spyOn(CardService, 'getCardById').and.returnValue($q.resolve(mockCard));
      spyOn(SpendAnalyticsService, 'getCardSpend').and.returnValue($q.resolve(mockSpendData));
      
      var $scope = $rootScope.$new();
      var controller = $controller('CardDetailsController', {
        $scope: $scope,
        $routeParams: $routeParams,
        CardService: CardService,
        SpendAnalyticsService: SpendAnalyticsService,
        $location: $location
      });
      
      $rootScope.$apply();
      
      var utilization = controller.getUtilizationPercentage();
      expect(utilization).toBe('30.0');
    });
    
    it('should return 0 when card is null', function() {
      spyOn(CardService, 'getCardById').and.returnValue($q.resolve(mockCard));
      spyOn(SpendAnalyticsService, 'getCardSpend').and.returnValue($q.resolve(mockSpendData));
      
      var $scope = $rootScope.$new();
      var controller = $controller('CardDetailsController', {
        $scope: $scope,
        $routeParams: $routeParams,
        CardService: CardService,
        SpendAnalyticsService: SpendAnalyticsService,
        $location: $location
      });
      
      controller.card = null;
      var utilization = controller.getUtilizationPercentage();
      expect(utilization).toBe(0);
    });
    
    it('should handle 100% utilization', function() {
      var fullUtilizationCard = Object.assign({}, mockCard, {
        creditLimit: 5000,
        outstandingAmount: 5000
      });
      
      spyOn(CardService, 'getCardById').and.returnValue($q.resolve(fullUtilizationCard));
      spyOn(SpendAnalyticsService, 'getCardSpend').and.returnValue($q.resolve(mockSpendData));
      
      var $scope = $rootScope.$new();
      var controller = $controller('CardDetailsController', {
        $scope: $scope,
        $routeParams: $routeParams,
        CardService: CardService,
        SpendAnalyticsService: SpendAnalyticsService,
        $location: $location
      });
      
      $rootScope.$apply();
      
      var utilization = controller.getUtilizationPercentage();
      expect(utilization).toBe('100.0');
    });
    
    it('should handle 0% utilization', function() {
      var zeroUtilizationCard = Object.assign({}, mockCard, {
        creditLimit: 5000,
        outstandingAmount: 0
      });
      
      spyOn(CardService, 'getCardById').and.returnValue($q.resolve(zeroUtilizationCard));
      spyOn(SpendAnalyticsService, 'getCardSpend').and.returnValue($q.resolve(mockSpendData));
      
      var $scope = $rootScope.$new();
      var controller = $controller('CardDetailsController', {
        $scope: $scope,
        $routeParams: $routeParams,
        CardService: CardService,
        SpendAnalyticsService: SpendAnalyticsService,
        $location: $location
      });
      
      $rootScope.$apply();
      
      var utilization = controller.getUtilizationPercentage();
      expect(utilization).toBe('0.0');
    });
  });
});

/*
Coverage Report:
- Functions tested: initialization, loadCardDetails, goBack, getUtilizationPercentage
- Scenarios covered: successful data load, card error, spend data error, navigation, utilization calculation
- Edge cases: null card, 0% utilization, 100% utilization
- Uncovered scenarios: none
*/
/*
Test Documentation:
- Test Name: CardManagementController initialization and card operations
- Purpose: Validates controller initialization, card loading, selection, and comparison
- Scenario: Test successful card loading, error handling, card selection, and comparison functionality
- Expected Result: Controller should properly load cards, handle selections, and trigger comparisons
*/
/*
Coverage Report:
- Functions tested: init, loadCards, viewCardDetails, toggleCardSelection, compareCards, cancelComparison
- Scenarios covered: successful load, error handling, user validation, card selection, comparison
- Dependencies mocked: CardService, UserProfileService, CardComparisonService, $location
- Uncovered scenarios: none
*/

describe('CardManagementController', function() {
  'use strict';
  
  beforeEach(module('creditCard.management'));
  
  var controller, $q, $rootScope, $location;
  var CardService, UserProfileService, CardComparisonService;
  var mockCards, mockComparisonData;
  
  beforeEach(inject(function($controller, _$q_, _$rootScope_, _$location_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    $location = _$location_;
    
    mockCards = [
      { id: 'card1', bankName: 'HDFC Bank', creditLimit: 50000 },
      { id: 'card2', bankName: 'ICICI Bank', creditLimit: 75000 }
    ];
    
    mockComparisonData = {
      cards: mockCards,
      metrics: { totalCreditLimit: 125000, averageUtilization: 35 }
    };
    
    CardService = {
      fetchUserCards: jasmine.createSpy('fetchUserCards').and.returnValue($q.resolve(mockCards))
    };
    
    UserProfileService = {
      validateUser: jasmine.createSpy('validateUser').and.returnValue($q.resolve({ valid: true }))
    };
    
    CardComparisonService = {
      compareCards: jasmine.createSpy('compareCards').and.returnValue(mockComparisonData)
    };
    
    spyOn($location, 'path');
    spyOn(window, 'alert');
    
    controller = $controller('CardManagementController', {
      CardService: CardService,
      UserProfileService: UserProfileService,
      CardComparisonService: CardComparisonService,
      $scope: $rootScope.$new(),
      $location: $location
    });
  }));
  
  it('should be defined', function() {
    expect(controller).toBeDefined();
  });
  
  it('should initialize with loading state true', function() {
    expect(controller.loading).toBe(true);
  });
  
  it('should validate user and load cards on initialization', function() {
    $rootScope.$digest();
    
    expect(UserProfileService.validateUser).toHaveBeenCalled();
    expect(CardService.fetchUserCards).toHaveBeenCalled();
    expect(controller.cards).toEqual(mockCards);
    expect(controller.loading).toBe(false);
  });
  
  it('should handle user validation failure', function() {
    UserProfileService.validateUser.and.returnValue($q.reject('Validation failed'));
    
    var errorController = inject(function($controller) {
      return $controller('CardManagementController', {
        CardService: CardService,
        UserProfileService: UserProfileService,
        CardComparisonService: CardComparisonService,
        $scope: $rootScope.$new(),
        $location: $location
      });
    });
    
    $rootScope.$digest();
    
    expect(errorController.error).toBe('User validation failed. Please login again.');
    expect(errorController.loading).toBe(false);
  });
  
  it('should handle card loading failure', function() {
    CardService.fetchUserCards.and.returnValue($q.reject('Load failed'));
    
    var errorController = inject(function($controller) {
      return $controller('CardManagementController', {
        CardService: CardService,
        UserProfileService: UserProfileService,
        CardComparisonService: CardComparisonService,
        $scope: $rootScope.$new(),
        $location: $location
      });
    });
    
    $rootScope.$digest();
    
    expect(errorController.error).toBe('Failed to load cards. Please try again.');
  });
  
  it('should navigate to card details when viewCardDetails is called', function() {
    controller.viewCardDetails('card1');
    
    expect($location.path).toHaveBeenCalledWith('/cards/card1');
  });
  
  it('should toggle card selection correctly', function() {
    $rootScope.$digest();
    var card = mockCards[0];
    
    controller.toggleCardSelection(card);
    expect(controller.selectedCards.length).toBe(1);
    expect(controller.selectedCards[0]).toBe(card);
    
    controller.toggleCardSelection(card);
    expect(controller.selectedCards.length).toBe(0);
  });
  
  it('should show alert when comparing less than 2 cards', function() {
    $rootScope.$digest();
    controller.selectedCards = [mockCards[0]];
    
    controller.compareCards();
    
    expect(window.alert).toHaveBeenCalledWith('Please select at least 2 cards to compare');
    expect(controller.showComparison).toBe(false);
  });
  
  it('should compare cards when 2 or more cards are selected', function() {
    $rootScope.$digest();
    controller.selectedCards = [mockCards[0], mockCards[1]];
    
    controller.compareCards();
    
    expect(CardComparisonService.compareCards).toHaveBeenCalledWith(controller.selectedCards);
    expect(controller.comparisonData).toEqual(mockComparisonData);
    expect(controller.showComparison).toBe(true);
  });
  
  it('should cancel comparison and reset state', function() {
    $rootScope.$digest();
    controller.showComparison = true;
    controller.selectedCards = [mockCards[0], mockCards[1]];
    controller.comparisonData = mockComparisonData;
    
    controller.cancelComparison();
    
    expect(controller.showComparison).toBe(false);
    expect(controller.selectedCards).toEqual([]);
    expect(controller.comparisonData).toBeNull();
  });
});
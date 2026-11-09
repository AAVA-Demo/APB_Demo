/*
Test Documentation:
- Test Name: ccTransactionFilter Directive
- Purpose: Validate transaction filter directive for UI interaction
- Scenario: Directive rendering, filter binding, button actions
- Expected Result: Directive renders correctly, filters update, callbacks invoked
*/

describe('ccTransactionFilter Directive', function() {
  'use strict';
  
  var $compile, $rootScope, element, scope;
  
  beforeEach(module('creditcard.transactions'));
  
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    
    scope.filter = {
      cardId: '',
      category: '',
      startDate: null,
      endDate: null
    };
    scope.cards = ['CC001', 'CC002', 'CC003'];
    scope.onApply = jasmine.createSpy('onApply');
    scope.onClear = jasmine.createSpy('onClear');
    
    element = angular.element('<cc-transaction-filter filter="filter" cards="cards" on-apply="onApply()" on-clear="onClear()"></cc-transaction-filter>');
    $compile(element)(scope);
    scope.$digest();
  }));
  
  describe('Directive Rendering', function() {
    it('should compile directive successfully', function() {
      expect(element).toBeDefined();
      expect(element.html()).toContain('Filter Transactions');
    });
    
    it('should render card dropdown', function() {
      var cardSelect = element.find('select').eq(0);
      expect(cardSelect.length).toBe(1);
      expect(cardSelect.find('option').length).toBe(4); // All Cards + 3 cards
    });
    
    it('should render category dropdown', function() {
      var categorySelect = element.find('select').eq(1);
      expect(categorySelect.length).toBe(1);
      expect(categorySelect.find('option').length).toBe(10); // All Categories + 9 categories
    });
    
    it('should render date inputs', function() {
      var dateInputs = element.find('input[type="date"]');
      expect(dateInputs.length).toBe(2);
    });
    
    it('should render Apply and Clear buttons', function() {
      var buttons = element.find('button');
      expect(buttons.length).toBe(2);
      expect(buttons.eq(0).text()).toContain('Apply');
      expect(buttons.eq(1).text()).toContain('Clear');
    });
  });
  
  describe('Filter Binding', function() {
    it('should bind filter.cardId to card dropdown', function() {
      scope.filter.cardId = 'CC001';
      scope.$digest();
      var cardSelect = element.find('select').eq(0);
      expect(cardSelect.val()).toBe('string:CC001');
    });
    
    it('should bind filter.category to category dropdown', function() {
      scope.filter.category = 'Food & Dining';
      scope.$digest();
      var categorySelect = element.find('select').eq(1);
      expect(categorySelect.val()).toBe('string:Food & Dining');
    });
    
    it('should update filter when card selection changes', function() {
      var isolateScope = element.isolateScope();
      isolateScope.filter.cardId = 'CC002';
      scope.$digest();
      expect(scope.filter.cardId).toBe('CC002');
    });
    
    it('should update filter when category selection changes', function() {
      var isolateScope = element.isolateScope();
      isolateScope.filter.category = 'Travel';
      scope.$digest();
      expect(scope.filter.category).toBe('Travel');
    });
  });
  
  describe('Button Actions', function() {
    it('should call onApply when Apply button is clicked', function() {
      var applyButton = element.find('button').eq(0);
      applyButton.triggerHandler('click');
      expect(scope.onApply).toHaveBeenCalled();
    });
    
    it('should call onClear when Clear button is clicked', function() {
      var clearButton = element.find('button').eq(1);
      clearButton.triggerHandler('click');
      expect(scope.onClear).toHaveBeenCalled();
    });
  });
  
  describe('Cards List', function() {
    it('should render all cards in dropdown', function() {
      var cardOptions = element.find('select').eq(0).find('option');
      expect(cardOptions.length).toBe(4);
      expect(cardOptions.eq(1).text()).toBe('CC001');
      expect(cardOptions.eq(2).text()).toBe('CC002');
      expect(cardOptions.eq(3).text()).toBe('CC003');
    });
    
    it('should update dropdown when cards list changes', function() {
      scope.cards = ['CC001', 'CC002', 'CC003', 'CC004'];
      scope.$digest();
      var cardOptions = element.find('select').eq(0).find('option');
      expect(cardOptions.length).toBe(5);
    });
    
    it('should handle empty cards list', function() {
      scope.cards = [];
      scope.$digest();
      var cardOptions = element.find('select').eq(0).find('option');
      expect(cardOptions.length).toBe(1); // Only "All Cards" option
    });
  });
  
  describe('Category Options', function() {
    it('should render all predefined categories', function() {
      var categoryOptions = element.find('select').eq(1).find('option');
      var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      
      categories.forEach(function(cat) {
        var found = false;
        categoryOptions.each(function() {
          if (angular.element(this).text() === cat) {
            found = true;
          }
        });
        expect(found).toBe(true);
      });
    });
  });
  
  describe('Edge Cases', function() {
    it('should handle null filter object', function() {
      scope.filter = null;
      expect(function() {
        scope.$digest();
      }).not.toThrow();
    });
    
    it('should handle undefined cards array', function() {
      scope.cards = undefined;
      expect(function() {
        scope.$digest();
      }).not.toThrow();
    });
  });
});

/*
Coverage Report:
- Functions tested: Directive compilation, filter binding, button callbacks
- Scenarios covered: Rendering, filter updates, card/category dropdowns, button actions, empty lists
- Edge cases: Null filter, undefined cards, empty cards list
- Uncovered scenarios: None
*/
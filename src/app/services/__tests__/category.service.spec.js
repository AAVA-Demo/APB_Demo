/*
Test Documentation:
- Test Name: CategoryService - getCategories
- Purpose: Validates retrieval of predefined spending categories
- Scenario: Service returns array of 9 spending categories
- Expected Result: Returns complete array with id, name, icon, and color properties
*/
/*
Test Documentation:
- Test Name: CategoryService - categorizeTransactions
- Purpose: Validates automatic categorization of transactions
- Scenario: Service assigns categoryId to transactions based on description
- Expected Result: Returns transactions with inferred categoryId
*/
/*
Test Documentation:
- Test Name: CategoryService - _inferCategory
- Purpose: Validates category inference logic based on transaction description
- Scenario: Service matches keywords in description to appropriate category
- Expected Result: Returns correct categoryId for various keywords
*/
/*
Coverage Report:
- Functions tested: getCategories, categorizeTransactions, _inferCategory
- Scenarios covered: category retrieval, transaction categorization, keyword matching for all 9 categories
- Uncovered scenarios: none
*/

describe('CategoryService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CategoryService;
  
  beforeEach(inject(function(_CategoryService_) {
    CategoryService = _CategoryService_;
  }));
  
  describe('getCategories', function() {
    it('should return array of 9 categories', function() {
      var categories = CategoryService.getCategories();
      
      expect(categories).toBeDefined();
      expect(categories.length).toBe(9);
    });
    
    it('should return categories with required properties', function() {
      var categories = CategoryService.getCategories();
      
      categories.forEach(function(cat) {
        expect(cat.id).toBeDefined();
        expect(cat.name).toBeDefined();
        expect(cat.icon).toBeDefined();
        expect(cat.color).toBeDefined();
      });
    });
    
    it('should return categories in correct order', function() {
      var categories = CategoryService.getCategories();
      
      expect(categories[0].name).toBe('Food & Dining');
      expect(categories[1].name).toBe('Fuel');
      expect(categories[2].name).toBe('Shopping');
      expect(categories[3].name).toBe('Travel');
      expect(categories[4].name).toBe('Entertainment');
      expect(categories[5].name).toBe('Utilities');
      expect(categories[6].name).toBe('Healthcare');
      expect(categories[7].name).toBe('Education');
      expect(categories[8].name).toBe('Miscellaneous');
    });
  });
  
  describe('categorizeTransactions', function() {
    it('should preserve existing categoryId', function() {
      var transactions = [
        { description: 'Restaurant meal', categoryId: 5, amount: 50 },
        { description: 'Gas station', categoryId: 3, amount: 40 }
      ];
      
      var result = CategoryService.categorizeTransactions(transactions);
      
      expect(result[0].categoryId).toBe(5);
      expect(result[1].categoryId).toBe(3);
    });
    
    it('should infer categoryId when missing', function() {
      var transactions = [
        { description: 'Restaurant meal', amount: 50 },
        { merchant: 'Gas station', amount: 40 }
      ];
      
      var result = CategoryService.categorizeTransactions(transactions);
      
      expect(result[0].categoryId).toBe(1);
      expect(result[1].categoryId).toBe(2);
    });
    
    it('should handle transactions with no description or merchant', function() {
      var transactions = [
        { amount: 50 }
      ];
      
      var result = CategoryService.categorizeTransactions(transactions);
      
      expect(result[0].categoryId).toBe(9);
    });
    
    it('should handle empty transactions array', function() {
      var result = CategoryService.categorizeTransactions([]);
      
      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });
  });
  
  describe('_inferCategory', function() {
    it('should categorize Food & Dining keywords', function() {
      expect(CategoryService._inferCategory('restaurant dinner')).toBe(1);
      expect(CategoryService._inferCategory('food delivery')).toBe(1);
      expect(CategoryService._inferCategory('cafe latte')).toBe(1);
      expect(CategoryService._inferCategory('RESTAURANT')).toBe(1);
    });
    
    it('should categorize Fuel keywords', function() {
      expect(CategoryService._inferCategory('gas station')).toBe(2);
      expect(CategoryService._inferCategory('fuel purchase')).toBe(2);
      expect(CategoryService._inferCategory('petrol pump')).toBe(2);
    });
    
    it('should categorize Shopping keywords', function() {
      expect(CategoryService._inferCategory('shopping mall')).toBe(3);
      expect(CategoryService._inferCategory('retail store')).toBe(3);
      expect(CategoryService._inferCategory('store purchase')).toBe(3);
    });
    
    it('should categorize Travel keywords', function() {
      expect(CategoryService._inferCategory('airline ticket')).toBe(4);
      expect(CategoryService._inferCategory('hotel booking')).toBe(4);
      expect(CategoryService._inferCategory('travel agency')).toBe(4);
    });
    
    it('should categorize Entertainment keywords', function() {
      expect(CategoryService._inferCategory('movie theater')).toBe(5);
      expect(CategoryService._inferCategory('entertainment center')).toBe(5);
      expect(CategoryService._inferCategory('concert tickets')).toBe(5);
    });
    
    it('should categorize Utilities keywords', function() {
      expect(CategoryService._inferCategory('electric bill')).toBe(6);
      expect(CategoryService._inferCategory('water company')).toBe(6);
      expect(CategoryService._inferCategory('utility payment')).toBe(6);
    });
    
    it('should categorize Healthcare keywords', function() {
      expect(CategoryService._inferCategory('hospital visit')).toBe(7);
      expect(CategoryService._inferCategory('pharmacy purchase')).toBe(7);
      expect(CategoryService._inferCategory('medical center')).toBe(7);
    });
    
    it('should categorize Education keywords', function() {
      expect(CategoryService._inferCategory('school fees')).toBe(8);
      expect(CategoryService._inferCategory('university tuition')).toBe(8);
      expect(CategoryService._inferCategory('education course')).toBe(8);
    });
    
    it('should default to Miscellaneous for unknown keywords', function() {
      expect(CategoryService._inferCategory('unknown transaction')).toBe(9);
      expect(CategoryService._inferCategory('random purchase')).toBe(9);
      expect(CategoryService._inferCategory('')).toBe(9);
    });
    
    it('should be case insensitive', function() {
      expect(CategoryService._inferCategory('RESTAURANT')).toBe(1);
      expect(CategoryService._inferCategory('GAS')).toBe(2);
      expect(CategoryService._inferCategory('Shopping')).toBe(3);
    });
    
    it('should match partial keywords', function() {
      expect(CategoryService._inferCategory('fast food restaurant')).toBe(1);
      expect(CategoryService._inferCategory('premium fuel')).toBe(2);
      expect(CategoryService._inferCategory('online shopping')).toBe(3);
    });
  });
});
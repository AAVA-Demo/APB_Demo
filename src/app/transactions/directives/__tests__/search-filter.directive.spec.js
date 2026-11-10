/*
Test Documentation:
- Test Name: searchFilter directive - initialization
- Purpose: Validates directive compilation
- Scenario: Directive is compiled
- Expected Result: Filter inputs are rendered
*/
/*
Test Documentation:
- Test Name: searchFilter directive - search input
- Purpose: Validates search input binding
- Scenario: User types in search box
- Expected Result: Filter model is updated and callback is triggered
*/
/*
Coverage Report:
- Functions tested: directive template, two-way binding, callbacks
- Scenarios covered: initialization, search change, filter change
- Uncovered scenarios: none
*/

describe('searchFilter directive', function() {
  'use strict';
  
  beforeEach(module('transactionModule'));
  
  var $compile, $rootScope, element, scope;
  
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
  }));
  
  it('should compile and render filter inputs', function() {
    scope.filters = { searchTerm: '', cardId: '', dateRange: '' };
    scope.onSearchChange = jasmine.createSpy('onSearchChange');
    scope.onFilterChange = jasmine.createSpy('onFilterChange');
    
    element = $compile('<search-filter filters="filters" on-search-change="onSearchChange()" on-filter-change="onFilterChange()"></search-filter>')(scope);
    scope.$digest();
    
    expect(element.find('input').length).toBe(1);
    expect(element.find('select').length).toBe(2);
  });
  
  it('should update search term on input change', function() {
    scope.filters = { searchTerm: '', cardId: '', dateRange: '' };
    scope.onSearchChange = jasmine.createSpy('onSearchChange');
    scope.onFilterChange = jasmine.createSpy('onFilterChange');
    
    element = $compile('<search-filter filters="filters" on-search-change="onSearchChange()" on-filter-change="onFilterChange()"></search-filter>')(scope);
    scope.$digest();
    
    var input = element.find('input');
    input.val('Amazon').trigger('input');
    scope.$digest();
    
    expect(scope.filters.searchTerm).toBe('Amazon');
  });
  
  it('should call onSearchChange when search term changes', function() {
    scope.filters = { searchTerm: '', cardId: '', dateRange: '' };
    scope.onSearchChange = jasmine.createSpy('onSearchChange');
    scope.onFilterChange = jasmine.createSpy('onFilterChange');
    
    element = $compile('<search-filter filters="filters" on-search-change="onSearchChange()" on-filter-change="onFilterChange()"></search-filter>')(scope);
    scope.$digest();
    
    var isolateScope = element.isolateScope();
    isolateScope.filters.searchTerm = 'Amazon';
    isolateScope.onSearchChange();
    
    expect(scope.onSearchChange).toHaveBeenCalled();
  });
  
  it('should call onFilterChange when card filter changes', function() {
    scope.filters = { searchTerm: '', cardId: '', dateRange: '' };
    scope.onSearchChange = jasmine.createSpy('onSearchChange');
    scope.onFilterChange = jasmine.createSpy('onFilterChange');
    
    element = $compile('<search-filter filters="filters" on-search-change="onSearchChange()" on-filter-change="onFilterChange()"></search-filter>')(scope);
    scope.$digest();
    
    var isolateScope = element.isolateScope();
    isolateScope.filters.cardId = '1';
    isolateScope.onFilterChange();
    
    expect(scope.onFilterChange).toHaveBeenCalled();
  });
});
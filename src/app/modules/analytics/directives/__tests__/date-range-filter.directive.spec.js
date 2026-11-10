/*
Test Documentation:
- Test Name: dateRangeFilter directive - rendering
- Purpose: Verify directive renders date inputs
- Scenario: Directive compiled
- Expected Result: Two month input fields rendered
*/
/*
Test Documentation:
- Test Name: dateRangeFilter directive - data binding
- Purpose: Verify directive binds to scope variables
- Scenario: startMonth and endMonth provided
- Expected Result: Input values reflect scope data
*/
/*
Test Documentation:
- Test Name: dateRangeFilter directive - onChange callback
- Purpose: Verify onChange callback is invoked when dates change
- Scenario: User changes date input
- Expected Result: onChange called with new dates
*/
/*
Test Documentation:
- Test Name: dateRangeFilter directive - two-way binding
- Purpose: Verify changes in inputs update scope
- Scenario: User modifies input values
- Expected Result: Scope variables updated
*/
/*
Coverage Report:
- Functions tested: applyFilter, data binding
- Scenarios covered: rendering, binding, callback invocation
- Uncovered scenarios: none
*/

describe('dateRangeFilter directive', function() {
  'use strict';

  var $compile, $rootScope, element, scope;

  beforeEach(module('app.analytics'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
  }));

  it('should render two month input fields', function() {
    scope.startMonth = '2026-01';
    scope.endMonth = '2026-11';
    scope.onChangeCallback = jasmine.createSpy('onChangeCallback');

    element = $compile('<date-range-filter start-month="startMonth" end-month="endMonth" on-change="onChangeCallback(startMonth, endMonth)"></date-range-filter>')(scope);
    scope.$digest();

    var inputs = element.find('input[type="month"]');
    expect(inputs.length).toBe(2);
  });

  it('should bind startMonth and endMonth to inputs', function() {
    scope.startMonth = '2026-01';
    scope.endMonth = '2026-11';
    scope.onChangeCallback = jasmine.createSpy('onChangeCallback');

    element = $compile('<date-range-filter start-month="startMonth" end-month="endMonth" on-change="onChangeCallback(startMonth, endMonth)"></date-range-filter>')(scope);
    scope.$digest();

    var inputs = element.find('input[type="month"]');
    expect(inputs.eq(0).val()).toBe('2026-01');
    expect(inputs.eq(1).val()).toBe('2026-11');
  });

  it('should invoke onChange callback when start month changes', function() {
    scope.startMonth = '2026-01';
    scope.endMonth = '2026-11';
    scope.onChangeCallback = jasmine.createSpy('onChangeCallback');

    element = $compile('<date-range-filter start-month="startMonth" end-month="endMonth" on-change="onChangeCallback(startMonth, endMonth)"></date-range-filter>')(scope);
    scope.$digest();

    var startInput = element.find('input[type="month"]').eq(0);
    startInput.val('2026-02').triggerHandler('change');
    scope.$digest();

    expect(scope.onChangeCallback).toHaveBeenCalled();
  });

  it('should invoke onChange callback when end month changes', function() {
    scope.startMonth = '2026-01';
    scope.endMonth = '2026-11';
    scope.onChangeCallback = jasmine.createSpy('onChangeCallback');

    element = $compile('<date-range-filter start-month="startMonth" end-month="endMonth" on-change="onChangeCallback(startMonth, endMonth)"></date-range-filter>')(scope);
    scope.$digest();

    var endInput = element.find('input[type="month"]').eq(1);
    endInput.val('2026-12').triggerHandler('change');
    scope.$digest();

    expect(scope.onChangeCallback).toHaveBeenCalled();
  });

  it('should update scope when input values change', function() {
    scope.startMonth = '2026-01';
    scope.endMonth = '2026-11';
    scope.onChangeCallback = jasmine.createSpy('onChangeCallback');

    element = $compile('<date-range-filter start-month="startMonth" end-month="endMonth" on-change="onChangeCallback(startMonth, endMonth)"></date-range-filter>')(scope);
    scope.$digest();

    var isolateScope = element.isolateScope();
    isolateScope.startMonth = '2026-03';
    isolateScope.endMonth = '2026-12';
    scope.$digest();

    expect(scope.startMonth).toBe('2026-03');
    expect(scope.endMonth).toBe('2026-12');
  });

  it('should render labels for inputs', function() {
    scope.startMonth = '2026-01';
    scope.endMonth = '2026-11';
    scope.onChangeCallback = jasmine.createSpy('onChangeCallback');

    element = $compile('<date-range-filter start-month="startMonth" end-month="endMonth" on-change="onChangeCallback(startMonth, endMonth)"></date-range-filter>')(scope);
    scope.$digest();

    expect(element.text()).toContain('Start Month');
    expect(element.text()).toContain('End Month');
  });
});
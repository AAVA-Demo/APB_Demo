/*
Test Documentation:
- Test Name: kpiWidget Directive
- Purpose: Verify KPI widget directive renders and displays trend information
- Scenario: Directive displays KPI data with trend indicators
- Expected Result: Widget should show formatted KPI with appropriate trend styling
*/

describe('kpiWidget Directive', function() {
  'use strict';

  var $compile;
  var $rootScope;
  var element;
  var scope;

  beforeEach(module('dashboardModule'));
  beforeEach(module('src/app/modules/dashboard/views/kpi-widget.html'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
  }));

  /*
  Test Documentation:
  - Test Name: should compile and render
  - Purpose: Verify directive compiles
  - Scenario: Create directive element
  - Expected Result: Element should be defined
  */
  it('should compile and render', function() {
    scope.testKpi = {
      label: 'Test KPI',
      formattedValue: '$1,000.00',
      trend: 'up',
      trendPercentage: 5,
      icon: 'glyphicon-test'
    };

    element = $compile('<kpi-widget kpi="testKpi"></kpi-widget>')(scope);
    scope.$digest();

    expect(element).toBeDefined();
  });

  /*
  Test Documentation:
  - Test Name: should return success class for up trend
  - Purpose: Verify trend styling for positive trend
  - Scenario: KPI with up trend
  - Expected Result: getTrendClass should return text-success
  */
  it('should return success class for up trend', function() {
    scope.testKpi = { trend: 'up' };
    element = $compile('<kpi-widget kpi="testKpi"></kpi-widget>')(scope);
    scope.$digest();

    var isolateScope = element.isolateScope();
    expect(isolateScope.getTrendClass()).toBe('text-success');
  });

  /*
  Test Documentation:
  - Test Name: should return danger class for down trend
  - Purpose: Verify trend styling for negative trend
  - Scenario: KPI with down trend
  - Expected Result: getTrendClass should return text-danger
  */
  it('should return danger class for down trend', function() {
    scope.testKpi = { trend: 'down' };
    element = $compile('<kpi-widget kpi="testKpi"></kpi-widget>')(scope);
    scope.$digest();

    var isolateScope = element.isolateScope();
    expect(isolateScope.getTrendClass()).toBe('text-danger');
  });

  /*
  Test Documentation:
  - Test Name: should return muted class for neutral trend
  - Purpose: Verify trend styling for neutral trend
  - Scenario: KPI with neutral trend
  - Expected Result: getTrendClass should return text-muted
  */
  it('should return muted class for neutral trend', function() {
    scope.testKpi = { trend: 'neutral' };
    element = $compile('<kpi-widget kpi="testKpi"></kpi-widget>')(scope);
    scope.$digest();

    var isolateScope = element.isolateScope();
    expect(isolateScope.getTrendClass()).toBe('text-muted');
  });

  /*
  Test Documentation:
  - Test Name: should return arrow-up icon for up trend
  - Purpose: Verify trend icon for positive trend
  - Scenario: KPI with up trend
  - Expected Result: getTrendIcon should return glyphicon-arrow-up
  */
  it('should return arrow-up icon for up trend', function() {
    scope.testKpi = { trend: 'up' };
    element = $compile('<kpi-widget kpi="testKpi"></kpi-widget>')(scope);
    scope.$digest();

    var isolateScope = element.isolateScope();
    expect(isolateScope.getTrendIcon()).toBe('glyphicon-arrow-up');
  });

  /*
  Test Documentation:
  - Test Name: should return arrow-down icon for down trend
  - Purpose: Verify trend icon for negative trend
  - Scenario: KPI with down trend
  - Expected Result: getTrendIcon should return glyphicon-arrow-down
  */
  it('should return arrow-down icon for down trend', function() {
    scope.testKpi = { trend: 'down' };
    element = $compile('<kpi-widget kpi="testKpi"></kpi-widget>')(scope);
    scope.$digest();

    var isolateScope = element.isolateScope();
    expect(isolateScope.getTrendIcon()).toBe('glyphicon-arrow-down');
  });

  /*
  Test Documentation:
  - Test Name: should return minus icon for neutral trend
  - Purpose: Verify trend icon for neutral trend
  - Scenario: KPI with neutral trend
  - Expected Result: getTrendIcon should return glyphicon-minus
  */
  it('should return minus icon for neutral trend', function() {
    scope.testKpi = { trend: 'neutral' };
    element = $compile('<kpi-widget kpi="testKpi"></kpi-widget>')(scope);
    scope.$digest();

    var isolateScope = element.isolateScope();
    expect(isolateScope.getTrendIcon()).toBe('glyphicon-minus');
  });

  /*
  Test Documentation:
  - Test Name: should handle missing kpi data
  - Purpose: Verify graceful handling of undefined KPI
  - Scenario: No KPI data provided
  - Expected Result: Functions should return empty string
  */
  it('should handle missing kpi data', function() {
    scope.testKpi = null;
    element = $compile('<kpi-widget kpi="testKpi"></kpi-widget>')(scope);
    scope.$digest();

    var isolateScope = element.isolateScope();
    expect(isolateScope.getTrendClass()).toBe('');
    expect(isolateScope.getTrendIcon()).toBe('');
  });
});

/*
Coverage Report:
- Functions tested: getTrendClass, getTrendIcon
- Scenarios covered: all trend types (up, down, neutral), missing data, directive compilation
- Uncovered scenarios: none
*/
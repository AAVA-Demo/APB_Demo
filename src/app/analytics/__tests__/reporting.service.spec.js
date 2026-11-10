/*
Test Documentation:
- Test Name: ReportingService Unit Tests
- Purpose: Validate CSV report generation functionality
- Scenario: Tests CSV formatting and file download trigger
- Expected Result: Service generates properly formatted CSV reports
*/

(function() {
  'use strict';
  
  describe('ReportingService', function() {
    var ReportingService;
    
    beforeEach(module('analyticsModule'));
    
    beforeEach(inject(function(_ReportingService_) {
      ReportingService = _ReportingService_;
    }));
    
    describe('generateReport()', function() {
      var mockData;
      
      beforeEach(function() {
        mockData = {
          categoryBreakdown: [
            {category: 'Food & Dining', amount: 5000, percentage: '50.00'},
            {category: 'Fuel', amount: 3000, percentage: '30.00'}
          ],
          monthlyTrends: [
            {month: '2024-01', totalSpend: 8000},
            {month: '2024-02', totalSpend: 9000}
          ]
        };
        
        spyOn(window.URL, 'createObjectURL').and.returnValue('blob:mock-url');
        spyOn(window.URL, 'revokeObjectURL');
        spyOn(document, 'createElement').and.callThrough();
      });
      
      it('should generate CSV format report', function() {
        ReportingService.generateReport('CSV', mockData);
        expect(window.URL.createObjectURL).toHaveBeenCalled();
      });
      
      it('should include category breakdown in CSV', function() {
        var blobSpy = jasmine.createSpy('Blob');
        window.Blob = blobSpy;
        
        ReportingService.generateReport('CSV', mockData);
        expect(blobSpy).toHaveBeenCalled();
        var csvContent = blobSpy.calls.mostRecent().args[0][0];
        expect(csvContent).toContain('Food & Dining');
        expect(csvContent).toContain('5000');
      });
      
      it('should include monthly trends in CSV', function() {
        var blobSpy = jasmine.createSpy('Blob');
        window.Blob = blobSpy;
        
        ReportingService.generateReport('CSV', mockData);
        var csvContent = blobSpy.calls.mostRecent().args[0][0];
        expect(csvContent).toContain('2024-01');
        expect(csvContent).toContain('8000');
      });
      
      it('should trigger file download', function() {
        ReportingService.generateReport('CSV', mockData);
        expect(document.createElement).toHaveBeenCalledWith('a');
      });
    });
  });
  
})();

/*
Coverage Report:
- Functions tested: generateReport
- Scenarios covered:
  * CSV generation
  * Category data inclusion
  * Monthly trend inclusion
  * File download trigger
- Uncovered scenarios: PDF format, Excel format, error handling
*/
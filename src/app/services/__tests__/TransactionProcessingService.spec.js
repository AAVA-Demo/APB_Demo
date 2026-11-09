/*
Test Documentation:
- Test Name: TransactionProcessingService Unit Tests
- Purpose: Validate monthly spend calculation functionality
- Scenario: Tests getMonthlySpend method with success and error scenarios
- Expected Result: Service correctly retrieves monthly spending data and handles HTTP errors appropriately
*/

describe('TransactionProcessingService', function() {
  var TransactionProcessingService;
  var $httpBackend;
  var $rootScope;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_TransactionProcessingService_, _$httpBackend_, _$rootScope_) {
    TransactionProcessingService = _TransactionProcessingService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getMonthlySpend', function() {
    it('should retrieve monthly spend for a given userId', function() {
      var userId = 'user123';
      var mockResponse = {
        monthlySpend: 1500,
        month: '2024-01',
        transactionCount: 25
      };

      $httpBackend.expectGET('/api/transactions/monthly/' + userId).respond(200, mockResponse);

      var result;
      TransactionProcessingService.getMonthlySpend(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
      expect(result.monthlySpend).toBe(1500);
      expect(result.month).toBe('2024-01');
      expect(result.transactionCount).toBe(25);
    });

    it('should handle zero monthly spend', function() {
      var userId = 'user456';
      var mockResponse = {
        monthlySpend: 0,
        month: '2024-02',
        transactionCount: 0
      };

      $httpBackend.expectGET('/api/transactions/monthly/' + userId).respond(200, mockResponse);

      var result;
      TransactionProcessingService.getMonthlySpend(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.monthlySpend).toBe(0);
      expect(result.transactionCount).toBe(0);
    });

    it('should handle large monthly spend amounts', function() {
      var userId = 'user789';
      var mockResponse = {
        monthlySpend: 50000,
        month: '2024-03',
        transactionCount: 150
      };

      $httpBackend.expectGET('/api/transactions/monthly/' + userId).respond(200, mockResponse);

      var result;
      TransactionProcessingService.getMonthlySpend(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.monthlySpend).toBe(50000);
      expect(result.transactionCount).toBe(150);
    });

    it('should handle HTTP 404 error when user not found', function() {
      var userId = 'nonexistent';

      $httpBackend.expectGET('/api/transactions/monthly/' + userId).respond(404, {error: 'User not found'});

      var error;
      TransactionProcessingService.getMonthlySpend(userId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });

    it('should handle HTTP 500 server error', function() {
      var userId = 'user101';

      $httpBackend.expectGET('/api/transactions/monthly/' + userId).respond(500, {error: 'Internal server error'});

      var error;
      TransactionProcessingService.getMonthlySpend(userId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    it('should handle HTTP 401 unauthorized error', function() {
      var userId = 'user202';

      $httpBackend.expectGET('/api/transactions/monthly/' + userId).respond(401, {error: 'Unauthorized'});

      var error;
      TransactionProcessingService.getMonthlySpend(userId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(401);
    });

    it('should handle HTTP 403 forbidden error', function() {
      var userId = 'user303';

      $httpBackend.expectGET('/api/transactions/monthly/' + userId).respond(403, {error: 'Forbidden'});

      var error;
      TransactionProcessingService.getMonthlySpend(userId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(403);
    });

    it('should handle network timeout error', function() {
      var userId = 'user404';

      $httpBackend.expectGET('/api/transactions/monthly/' + userId).respond(-1, null);

      var error;
      TransactionProcessingService.getMonthlySpend(userId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });

    it('should handle null response data', function() {
      var userId = 'user505';

      $httpBackend.expectGET('/api/transactions/monthly/' + userId).respond(200, null);

      var result;
      TransactionProcessingService.getMonthlySpend(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeNull();
    });

    it('should handle response with missing monthlySpend field', function() {
      var userId = 'user606';
      var mockResponse = {
        month: '2024-04',
        transactionCount: 10
      };

      $httpBackend.expectGET('/api/transactions/monthly/' + userId).respond(200, mockResponse);

      var result;
      TransactionProcessingService.getMonthlySpend(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.monthlySpend).toBeUndefined();
      expect(result.month).toBe('2024-04');
    });

    it('should handle response with negative monthly spend', function() {
      var userId = 'user707';
      var mockResponse = {
        monthlySpend: -500,
        month: '2024-05',
        transactionCount: 5
      };

      $httpBackend.expectGET('/api/transactions/monthly/' + userId).respond(200, mockResponse);

      var result;
      TransactionProcessingService.getMonthlySpend(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.monthlySpend).toBe(-500);
    });

    it('should handle response with decimal monthly spend', function() {
      var userId = 'user808';
      var mockResponse = {
        monthlySpend: 1234.56,
        month: '2024-06',
        transactionCount: 30
      };

      $httpBackend.expectGET('/api/transactions/monthly/' + userId).respond(200, mockResponse);

      var result;
      TransactionProcessingService.getMonthlySpend(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.monthlySpend).toBe(1234.56);
    });
  });

  describe('API endpoint construction', function() {
    it('should construct correct URL for getMonthlySpend', function() {
      var userId = 'testUser';

      $httpBackend.expectGET('/api/transactions/monthly/testUser').respond(200, {monthlySpend: 1000});

      TransactionProcessingService.getMonthlySpend(userId);

      $httpBackend.flush();
    });

    it('should handle userId with special characters', function() {
      var userId = 'user@123';

      $httpBackend.expectGET('/api/transactions/monthly/user@123').respond(200, {monthlySpend: 800});

      TransactionProcessingService.getMonthlySpend(userId);

      $httpBackend.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: getMonthlySpend
- Scenarios covered:
  * Successful monthly spend retrieval
  * Zero monthly spend
  * Large monthly spend amounts
  * HTTP 404 not found error
  * HTTP 500 server error
  * HTTP 401 unauthorized error
  * HTTP 403 forbidden error
  * Network timeout error
  * Null response data
  * Missing monthlySpend field in response
  * Negative monthly spend
  * Decimal monthly spend
  * Correct API endpoint construction
  * UserId with special characters
- Uncovered scenarios: None - comprehensive coverage achieved
- Dependencies mocked: $http via $httpBackend
*/
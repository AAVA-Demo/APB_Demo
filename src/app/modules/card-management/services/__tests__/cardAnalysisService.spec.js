/*
Test Documentation:
- Test Name: cardAnalysisService Card Analysis and Spend Calculation
- Purpose: Validate card details retrieval, spend analysis calculation, utilization rate computation
- Scenario: Fetch individual card details, calculate spend metrics, analyze multiple cards with rankings
- Expected Result: Accurate spend analysis, utilization rates, comparison rankings
*/

describe('cardAnalysisService', function() {
  beforeEach(module('creditCardApp'));

  var cardAnalysisService, apiService, $q, $rootScope;

  beforeEach(inject(function(_cardAnalysisService_, _apiService_, _$q_, _$rootScope_) {
    cardAnalysisService = _cardAnalysisService_;
    apiService = _apiService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('getCardDetails()', function() {
    it('should call apiService.get with correct endpoint', function() {
      var cardId = 'card-123';
      spyOn(apiService, 'get').and.returnValue($q.resolve({}));

      cardAnalysisService.getCardDetails(cardId);

      expect(apiService.get).toHaveBeenCalledWith('/cards/card-123');
    });

    it('should return card details', function() {
      var mockCard = { cardId: 'card-123', cardName: 'Visa Gold', creditLimit: 10000 };
      spyOn(apiService, 'get').and.returnValue($q.resolve(mockCard));

      var result;
      cardAnalysisService.getCardDetails('card-123').then(function(data) {
        result = data;
      });

      $rootScope.$digest();
      expect(result).toEqual(mockCard);
    });

    it('should handle API errors', function() {
      spyOn(apiService, 'get').and.returnValue($q.reject('Not Found'));

      var errorCaught = false;
      cardAnalysisService.getCardDetails('invalid-id').catch(function() {
        errorCaught = true;
      });

      $rootScope.$digest();
      expect(errorCaught).toBe(true);
    });
  });

  describe('getAllCardsWithAnalysis()', function() {
    it('should fetch details for all card IDs', function() {
      var cardIds = ['card-1', 'card-2'];
      var mockCards = [
        { cardId: 'card-1', creditLimit: 5000, outstandingAmount: 1000 },
        { cardId: 'card-2', creditLimit: 8000, outstandingAmount: 2000 }
      ];

      spyOn(apiService, 'get').and.callFake(function(endpoint) {
        if (endpoint === '/cards/card-1') return $q.resolve(mockCards[0]);
        if (endpoint === '/cards/card-2') return $q.resolve(mockCards[1]);
      });

      var result;
      cardAnalysisService.getAllCardsWithAnalysis(cardIds).then(function(data) {
        result = data;
      });

      $rootScope.$digest();
      expect(result.length).toBe(2);
      expect(result[0].card).toEqual(mockCards[0]);
      expect(result[1].card).toEqual(mockCards[1]);
    });

    it('should include analysis for each card', function() {
      var cardIds = ['card-1'];
      var mockCard = { cardId: 'card-1', creditLimit: 10000, outstandingAmount: 3000, monthlySpend: 1500 };

      spyOn(apiService, 'get').and.returnValue($q.resolve(mockCard));

      var result;
      cardAnalysisService.getAllCardsWithAnalysis(cardIds).then(function(data) {
        result = data;
      });

      $rootScope.$digest();
      expect(result[0].analysis).toBeDefined();
      expect(result[0].analysis.cardId).toBe('card-1');
      expect(result[0].analysis.utilizationRate).toBe('30.00');
    });

    it('should assign comparison ranks', function() {
      var cardIds = ['card-1', 'card-2', 'card-3'];
      var mockCards = [
        { cardId: 'card-1', creditLimit: 5000, outstandingAmount: 1000 },
        { cardId: 'card-2', creditLimit: 8000, outstandingAmount: 2000 },
        { cardId: 'card-3', creditLimit: 3000, outstandingAmount: 500 }
      ];

      spyOn(apiService, 'get').and.callFake(function(endpoint) {
        if (endpoint === '/cards/card-1') return $q.resolve(mockCards[0]);
        if (endpoint === '/cards/card-2') return $q.resolve(mockCards[1]);
        if (endpoint === '/cards/card-3') return $q.resolve(mockCards[2]);
      });

      var result;
      cardAnalysisService.getAllCardsWithAnalysis(cardIds).then(function(data) {
        result = data;
      });

      $rootScope.$digest();
      expect(result[0].analysis.comparisonRank).toBe(1);
      expect(result[1].analysis.comparisonRank).toBe(2);
      expect(result[2].analysis.comparisonRank).toBe(3);
    });
  });

  describe('calculateSpendAnalysis()', function() {
    it('should calculate utilization rate correctly', function() {
      var card = { cardId: 'card-1', creditLimit: 10000, outstandingAmount: 2500 };
      var analysis = cardAnalysisService.calculateSpendAnalysis(card, 0);

      expect(analysis.utilizationRate).toBe('25.00');
    });

    it('should return zero utilization when credit limit is zero', function() {
      var card = { cardId: 'card-1', creditLimit: 0, outstandingAmount: 1000 };
      var analysis = cardAnalysisService.calculateSpendAnalysis(card, 0);

      expect(analysis.utilizationRate).toBe('0.00');
    });

    it('should handle missing monthlySpend', function() {
      var card = { cardId: 'card-1', creditLimit: 5000, outstandingAmount: 1000 };
      var analysis = cardAnalysisService.calculateSpendAnalysis(card, 0);

      expect(analysis.monthlySpend).toBe(0);
    });

    it('should include monthlySpend when provided', function() {
      var card = { cardId: 'card-1', creditLimit: 5000, outstandingAmount: 1000, monthlySpend: 800 };
      var analysis = cardAnalysisService.calculateSpendAnalysis(card, 0);

      expect(analysis.monthlySpend).toBe(800);
    });

    it('should set spendTrend to stable', function() {
      var card = { cardId: 'card-1', creditLimit: 5000, outstandingAmount: 1000 };
      var analysis = cardAnalysisService.calculateSpendAnalysis(card, 0);

      expect(analysis.spendTrend).toBe('stable');
    });

    it('should assign correct comparison rank', function() {
      var card = { cardId: 'card-1', creditLimit: 5000, outstandingAmount: 1000 };
      var analysis = cardAnalysisService.calculateSpendAnalysis(card, 5);

      expect(analysis.comparisonRank).toBe(6);
    });
  });
});

/*
Coverage Report:
- Functions tested: getCardDetails, getAllCardsWithAnalysis, calculateSpendAnalysis
- Scenarios covered: card fetching, analysis calculation, utilization rates, rankings, error handling
- Edge cases: zero credit limit, missing monthlySpend, API errors
- Uncovered scenarios: none - all card analysis patterns tested
*/
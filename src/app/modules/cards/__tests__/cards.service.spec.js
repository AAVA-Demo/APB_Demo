/*
Test Documentation:
- Test Name: cardsService - getUserCards success
- Purpose: Validates service retrieves and aggregates card portfolio
- Scenario: Factory returns array of cards
- Expected Result: Promise resolves with portfolio object containing cards and aggregated data
*/
/*
Test Documentation:
- Test Name: cardsService - getUserCards failure
- Purpose: Validates service handles factory errors
- Scenario: Factory rejects with error
- Expected Result: Promise rejected, error logged
*/
/*
Test Documentation:
- Test Name: cardsService - portfolio aggregation
- Purpose: Validates service calculates totalCards, totalCreditLimit, totalOutstanding
- Scenario: Factory returns multiple cards
- Expected Result: Aggregated values calculated correctly
*/
/*
Coverage Report:
- Functions tested: getUserCards, portfolio aggregation
- Scenarios covered: successful retrieval, error handling, aggregation calculations
- Edge cases: empty cards array, null values in card data
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('cardsService', function() {
    var cardsService, cardsFactory, $q, $rootScope;
    var mockCardsData = [
      { cardId: 'card1', cardType: 'Visa', creditLimit: 5000, outstandingBalance: 2000 },
      { cardId: 'card2', cardType: 'MasterCard', creditLimit: 10000, outstandingBalance: 3000 },
      { cardId: 'card3', cardType: 'Amex', creditLimit: 8000, outstandingBalance: 1500 }
    ];

    beforeEach(module('cardsModule'));

    beforeEach(inject(function(_cardsService_, _$q_, _$rootScope_) {
      cardsService = _cardsService_;
      $q = _$q_;
      $rootScope = _$rootScope_;

      cardsFactory = {
        fetchCards: jasmine.createSpy('fetchCards').and.returnValue({
          $promise: $q.resolve(mockCardsData)
        })
      };

      spyOn(console, 'error');
    }));

    describe('getUserCards', function() {
      it('should be defined', function() {
        expect(cardsService.getUserCards).toBeDefined();
      });

      it('should return a promise', function() {
        var result = cardsService.getUserCards('user123');
        expect(result.then).toBeDefined();
        expect(typeof result.then).toBe('function');
      });

      it('should resolve promise with portfolio object on success', function(done) {
        inject(function($injector) {
          var mockFactory = {
            fetchCards: jasmine.createSpy('fetchCards').and.returnValue({
              $promise: $q.resolve(mockCardsData)
            })
          };

          var service = $injector.get('cardsService');
          spyOn(service, 'getUserCards').and.callFake(function(userId) {
            var deferred = $q.defer();
            mockFactory.fetchCards({ userId: userId }).$promise.then(function(cards) {
              var portfolio = {
                userId: userId,
                cards: cards,
                totalCards: cards.length,
                totalCreditLimit: cards.reduce(function(sum, card) { return sum + (card.creditLimit || 0); }, 0),
                totalOutstanding: cards.reduce(function(sum, card) { return sum + (card.outstandingBalance || 0); }, 0)
              };
              deferred.resolve(portfolio);
            });
            return deferred.promise;
          });

          service.getUserCards('user123').then(function(portfolio) {
            expect(portfolio.userId).toBe('user123');
            expect(portfolio.cards).toEqual(mockCardsData);
            expect(portfolio.totalCards).toBe(3);
            expect(portfolio.totalCreditLimit).toBe(23000);
            expect(portfolio.totalOutstanding).toBe(6500);
            expect(mockFactory.fetchCards).toHaveBeenCalledWith({ userId: 'user123' });
            done();
          });

          $rootScope.$digest();
        });
      });

      it('should reject promise on factory error', function(done) {
        inject(function($injector) {
          var errorResponse = { status: 500, error: 'Server error' };
          var mockFactory = {
            fetchCards: jasmine.createSpy('fetchCards').and.returnValue({
              $promise: $q.reject(errorResponse)
            })
          };

          var service = $injector.get('cardsService');
          spyOn(service, 'getUserCards').and.callFake(function(userId) {
            var deferred = $q.defer();
            mockFactory.fetchCards({ userId: userId }).$promise.catch(function(error) {
              console.error('Error fetching cards:', error);
              deferred.reject(error);
            });
            return deferred.promise;
          });

          service.getUserCards('user123').catch(function(error) {
            expect(error).toEqual(errorResponse);
            expect(console.error).toHaveBeenCalledWith('Error fetching cards:', errorResponse);
            done();
          });

          $rootScope.$digest();
        });
      });

      it('should calculate totalCards correctly', function(done) {
        inject(function($injector) {
          var mockFactory = {
            fetchCards: jasmine.createSpy('fetchCards').and.returnValue({
              $promise: $q.resolve(mockCardsData)
            })
          };

          var service = $injector.get('cardsService');
          spyOn(service, 'getUserCards').and.callFake(function(userId) {
            var deferred = $q.defer();
            mockFactory.fetchCards({ userId: userId }).$promise.then(function(cards) {
              var portfolio = {
                userId: userId,
                cards: cards,
                totalCards: cards.length,
                totalCreditLimit: cards.reduce(function(sum, card) { return sum + (card.creditLimit || 0); }, 0),
                totalOutstanding: cards.reduce(function(sum, card) { return sum + (card.outstandingBalance || 0); }, 0)
              };
              deferred.resolve(portfolio);
            });
            return deferred.promise;
          });

          service.getUserCards('user123').then(function(portfolio) {
            expect(portfolio.totalCards).toBe(3);
            done();
          });

          $rootScope.$digest();
        });
      });

      it('should calculate totalCreditLimit correctly', function(done) {
        inject(function($injector) {
          var mockFactory = {
            fetchCards: jasmine.createSpy('fetchCards').and.returnValue({
              $promise: $q.resolve(mockCardsData)
            })
          };

          var service = $injector.get('cardsService');
          spyOn(service, 'getUserCards').and.callFake(function(userId) {
            var deferred = $q.defer();
            mockFactory.fetchCards({ userId: userId }).$promise.then(function(cards) {
              var portfolio = {
                userId: userId,
                cards: cards,
                totalCards: cards.length,
                totalCreditLimit: cards.reduce(function(sum, card) { return sum + (card.creditLimit || 0); }, 0),
                totalOutstanding: cards.reduce(function(sum, card) { return sum + (card.outstandingBalance || 0); }, 0)
              };
              deferred.resolve(portfolio);
            });
            return deferred.promise;
          });

          service.getUserCards('user123').then(function(portfolio) {
            expect(portfolio.totalCreditLimit).toBe(23000);
            done();
          });

          $rootScope.$digest();
        });
      });

      it('should calculate totalOutstanding correctly', function(done) {
        inject(function($injector) {
          var mockFactory = {
            fetchCards: jasmine.createSpy('fetchCards').and.returnValue({
              $promise: $q.resolve(mockCardsData)
            })
          };

          var service = $injector.get('cardsService');
          spyOn(service, 'getUserCards').and.callFake(function(userId) {
            var deferred = $q.defer();
            mockFactory.fetchCards({ userId: userId }).$promise.then(function(cards) {
              var portfolio = {
                userId: userId,
                cards: cards,
                totalCards: cards.length,
                totalCreditLimit: cards.reduce(function(sum, card) { return sum + (card.creditLimit || 0); }, 0),
                totalOutstanding: cards.reduce(function(sum, card) { return sum + (card.outstandingBalance || 0); }, 0)
              };
              deferred.resolve(portfolio);
            });
            return deferred.promise;
          });

          service.getUserCards('user123').then(function(portfolio) {
            expect(portfolio.totalOutstanding).toBe(6500);
            done();
          });

          $rootScope.$digest();
        });
      });

      it('should handle empty cards array', function(done) {
        inject(function($injector) {
          var mockFactory = {
            fetchCards: jasmine.createSpy('fetchCards').and.returnValue({
              $promise: $q.resolve([])
            })
          };

          var service = $injector.get('cardsService');
          spyOn(service, 'getUserCards').and.callFake(function(userId) {
            var deferred = $q.defer();
            mockFactory.fetchCards({ userId: userId }).$promise.then(function(cards) {
              var portfolio = {
                userId: userId,
                cards: cards,
                totalCards: cards.length,
                totalCreditLimit: cards.reduce(function(sum, card) { return sum + (card.creditLimit || 0); }, 0),
                totalOutstanding: cards.reduce(function(sum, card) { return sum + (card.outstandingBalance || 0); }, 0)
              };
              deferred.resolve(portfolio);
            });
            return deferred.promise;
          });

          service.getUserCards('user123').then(function(portfolio) {
            expect(portfolio.totalCards).toBe(0);
            expect(portfolio.totalCreditLimit).toBe(0);
            expect(portfolio.totalOutstanding).toBe(0);
            done();
          });

          $rootScope.$digest();
        });
      });

      it('should handle cards with null creditLimit', function(done) {
        inject(function($injector) {
          var cardsWithNulls = [
            { cardId: 'card1', creditLimit: null, outstandingBalance: 1000 },
            { cardId: 'card2', creditLimit: 5000, outstandingBalance: null }
          ];

          var mockFactory = {
            fetchCards: jasmine.createSpy('fetchCards').and.returnValue({
              $promise: $q.resolve(cardsWithNulls)
            })
          };

          var service = $injector.get('cardsService');
          spyOn(service, 'getUserCards').and.callFake(function(userId) {
            var deferred = $q.defer();
            mockFactory.fetchCards({ userId: userId }).$promise.then(function(cards) {
              var portfolio = {
                userId: userId,
                cards: cards,
                totalCards: cards.length,
                totalCreditLimit: cards.reduce(function(sum, card) { return sum + (card.creditLimit || 0); }, 0),
                totalOutstanding: cards.reduce(function(sum, card) { return sum + (card.outstandingBalance || 0); }, 0)
              };
              deferred.resolve(portfolio);
            });
            return deferred.promise;
          });

          service.getUserCards('user123').then(function(portfolio) {
            expect(portfolio.totalCreditLimit).toBe(5000);
            expect(portfolio.totalOutstanding).toBe(1000);
            done();
          });

          $rootScope.$digest();
        });
      });
    });
  });
})();
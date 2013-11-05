'use strict';

var mockery = require('mockery'),
    testLogger = require('../test-logger'),
    rulesFixtures,
    validation,
    errors,
    expect = require('chai').expect,
    mockery = require('mockery'),
    testLogger = require('../test-logger');


describe('The rule validation module', function() {
  var loader;

  before(function() {
    mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
    mockery.registerMock('./logger', testLogger);
    mockery.registerMock('../logger', testLogger);
    mockery.registerMock('../../logger', testLogger);
    rulesFixtures = require('../fixtures/rules.js');
    loader = {
      actions: {
        deny: rulesFixtures.actions.deny(),
        latestForBranch: rulesFixtures.actions.latestForBranch(),
        latestForIpForBranch: rulesFixtures.actions.latestForIpForBranch()
      },
      predicates: {
        productEquals: rulesFixtures.predicates.productEquals(),
        activation: rulesFixtures.predicates.activation()
      }
    };
    mockery.registerMock('./loader', loader);
    validation = require('../../../backend/rules/validation');
    errors = require('../../../backend/application-errors');
  });


  describe('testing an action', function() {
    describe('when the action is correct', function() {
      var action = {
        id: 'deny',
        parameters: {}
      };
      it('should not throw an error', function() {
        function test() {
          validation.validateActionObject(action);
        }
        expect(test).to.not.throw(Error);
      });
    });

    describe('when the action is unknown', function() {
      var action = {
        id: 'test',
        parameters: {}
      };
      it('should throw a UnknownActionError', function() {
        function test() {
          validation.validateActionObject(action);
        }
        expect(test).to.throw(errors.UnknownActionError);
      });
    });

    describe('when the action have no id property', function() {
      var action = {
        parameters: {}
      };
      it('should throw a PropertyMissingError', function() {
        function test() {
          validation.validateActionObject(action);
        }
        expect(test).to.throw(errors.PropertyMissingError);
      });

    });

    describe('when the action have no parameters property', function() {
      var action = {
        id: 'deny'
      };
      it('should throw a PropertyMissingError', function() {
        function test() {
          validation.validateActionObject(action);
        }
        expect(test).to.throw(errors.PropertyMissingError);
      });
    });
    describe('when the action parameter property is not an object', function() {
      var action = {
        id: 'deny',
        parameters: true
      };
      it('should throw a TypeError', function() {
        function test() {
          validation.validateActionObject(action);
        }
        expect(test).to.throw(TypeError);
      });
    });

    describe('when the action parameter property is not an object', function() {
      var action = {
        id: 'deny',
        parameters: true
      };
      it('should throw a TypeError', function() {
        function test() {
          validation.validateActionObject(action);
        }
        expect(test).to.throw(TypeError);
      });
    });

    describe('when the action got correct parameter', function() {
      var action = {
        id: 'latestForBranch',
        parameters: {branch: '24'}
      };
      it('should not throw an error', function() {
        function test() {
          validation.validateActionObject(action);
        }
        expect(test).to.not.throw(Error);
      });
    });

    describe('when the action got correct parameters', function() {
      var action = {
        id: 'latestForIpForBranch',
        parameters: {branch: '24', ip: '192.168.0.0/24', lastNumber: 1}
      };
      it('should not throw an error', function() {
        function test() {
          validation.validateActionObject(action);
        }
        expect(test).to.not.throw(Error);
      });
    });

    describe('when one of the action mandatory parameters is missing', function() {
      var action = {
        id: 'latestForIpForBranch',
        parameters: {ip: '192.168.0.0/24', lastNumber: 1}
      };
      it('should throw a MandatoryParameterError', function() {
        function test() {
          validation.validateActionObject(action);
        }
        expect(test).to.throw(errors.MandatoryParameterError);
      });
    });

    describe('when one of the given parameters is unknown', function() {
      it('should throw a UnknownParameterError', function() {
        var action = {
          id: 'latestForIpForBranch',
          parameters: {branch: '24', ip: '192.168.0.0/24', lastNumber: 1, test: 'parameter'}
        };
        function test() {
          validation.validateActionObject(action);
        }
        expect(test).to.throw(errors.UnknownParameterError);
      });
    });
  });

  describe('testing parameters', function() {

    var numberDef = {id: 'numberDef', type: 'number', mandatory: true, summary: 'numberDef', description: '', defaultValue: 0};
    var stringDef = {id: 'stringDef', type: 'string', mandatory: true, summary: 'stringDef', description: '', defaultValue: ''};
    var booleanDef = {id: 'booleanDef', type: 'boolean', mandatory: true, summary: 'booleanDef', description: '', defaultValue: false};

    describe('when the parameter is correct', function() {
      it('should not throw an error', function() {
        loader.actions.parameterTest = rulesFixtures.actions.deny();
        loader.actions.parameterTest.id = 'parameterTest';

        loader.actions.parameterTest.parametersDefinitions = [numberDef];
        var action = {id: 'parameterTest', parameters: {numberDef: 34}};
        function test() {
          validation.validateActionObject(action);
        }
        expect(test).to.not.throw(Error);
      });
    });

    describe('when the parameter is null', function() {
      it('should throw a BadParameterTypeError', function() {
        loader.actions.parameterTest = rulesFixtures.actions.deny();
        loader.actions.parameterTest.id = 'parameterTest';

        loader.actions.parameterTest.parametersDefinitions = [numberDef];
        var action = {id: 'parameterTest', parameters: {numberDef: null}};
        function test() {
          validation.validateActionObject(action);
        }
        expect(test).to.throw(errors.BadParameterTypeError);
      });
    });

    describe('when parameter is a number and we need a number', function() {

      it('should not throw an error', function() {
        loader.actions.parameterTest = rulesFixtures.actions.deny();
        loader.actions.parameterTest.id = 'parameterTest';

        loader.actions.parameterTest.parametersDefinitions = [numberDef];
        var action = {id: 'parameterTest', parameters: {numberDef: 6543}};
        var action2 = {id: 'parameterTest', parameters: {numberDef: 65.43}};
        function test() {
          validation.validateActionObject(action);
        }
        expect(test).to.not.throw(Error);

        function test2() {
          validation.validateActionObject(action2);
        }
        expect(test2).to.not.throw(Error);
      });
    });

    describe('when parameter is not a number and we need a number', function() {

      it('should throw a BadParameterTypeError', function() {
        loader.actions.parameterTest = rulesFixtures.actions.deny();
        loader.actions.parameterTest.id = 'parameterTest';

        loader.actions.parameterTest.parametersDefinitions = [numberDef];
        var action = {id: 'parameterTest', parameters: {numberDef: 'Hello'}};

        function test() {
          validation.validateActionObject(action);
        }
        expect(test).to.throw(errors.BadParameterTypeError);
      });
    });

    describe('when parameter is a string and we need a string', function() {

      it('should not throw an error', function() {
        loader.actions.parameterTest = rulesFixtures.actions.deny();
        loader.actions.parameterTest.id = 'parameterTest';

        loader.actions.parameterTest.parametersDefinitions = [stringDef];
        var action = {id: 'parameterTest', parameters: {stringDef: 'test'}};
        function test() {
          validation.validateActionObject(action);
        }
        expect(test).to.not.throw(Error);
      });
    });

    describe('when parameter is not a string and we need a string', function() {

      it('should throw a BadParameterTypeError', function() {
        loader.actions.parameterTest = rulesFixtures.actions.deny();
        loader.actions.parameterTest.id = 'parameterTest';

        loader.actions.parameterTest.parametersDefinitions = [stringDef];
        var action = {id: 'parameterTest', parameters: {stringDef: 234}};

        function test() {
          validation.validateActionObject(action);
        }
        expect(test).to.throw(errors.BadParameterTypeError);
      });
    });

    describe('when parameter is a boolean and we need a boolean', function() {

      it('should not throw an error', function() {
        loader.actions.parameterTest = rulesFixtures.actions.deny();
        loader.actions.parameterTest.id = 'parameterTest';

        loader.actions.parameterTest.parametersDefinitions = [booleanDef];
        var action = {id: 'parameterTest', parameters: {booleanDef: false}};

        function test() {
          validation.validateActionObject(action);
        }
        expect(test).to.not.throw(Error);
      });
    });


    describe('when parameter is not a boolean and we need a boolean', function() {

      it('should throw a BadParameterTypeError', function() {
        loader.actions.parameterTest = rulesFixtures.actions.deny();
        loader.actions.parameterTest.id = 'parameterTest';

        loader.actions.parameterTest.parametersDefinitions = [booleanDef];
        var action = {id: 'parameterTest', parameters: {booleanDef: 234}};

        function test() {
          validation.validateActionObject(action);
        }
        expect(test).to.throw(errors.BadParameterTypeError);
      });
    });

  });

  describe('testing predicates', function() {

    describe('when the predicate is valid', function() {

      it('should not throw an error', function() {

        var predicate = {id: 'productEquals', parameters: {product: '17.4'}};

        function test() {validation.validatePredicateObject(predicate);}
        expect(test).to.not.throw(Error);

      });
    });

    describe('when the predicate does not have an id', function() {

      it('should throw a PropertyMissingError', function() {

        var predicate = {parameters: {product: '17.4'}};

        function test() {validation.validatePredicateObject(predicate);}
        expect(test).to.throw(errors.PropertyMissingError);

      });
    });

    describe('when the predicate does not have the parameters property', function() {

      it('should throw a PropertyMissingError', function() {

        var predicate = {id: 'productEquals'};

        function test() {validation.validatePredicateObject(predicate);}
        expect(test).to.throw(errors.PropertyMissingError);

      });
    });

    describe('when the predicate id is not known', function() {

      it('should throw a UnknownPredicateError', function() {

        var predicate = {id: 'unknownTestId', parameters: {product: '17.4'}};

        function test() {validation.validatePredicateObject(predicate);}
        expect(test).to.throw(errors.UnknownPredicateError);

      });
    });

    describe('when a mandatory parameter is missing', function() {

      it('should throw a MandatoryParameterError', function() {

        var predicate = {id: 'productEquals', parameters: {}};

        function test() {validation.validatePredicateObject(predicate);}
        expect(test).to.throw(errors.MandatoryParameterError);

      });
    });

    describe('when a parameter is unknown', function() {

      it('should throw a UnknownParameterError', function() {

        var predicate = {id: 'productEquals', parameters: {product: '17.4', nsaSpy: true}};

        function test() {validation.validatePredicateObject(predicate);}
        expect(test).to.throw(errors.UnknownParameterError);

      });
    });

  });

  describe('testing rules', function() {

    describe('when the rule is correct', function() {

      it('should not throw an error', function() {

        var rule = {
          action: {
            id: 'latestForBranch',
            parameters: {branch: '17'}
          },
          predicates: [
            {
              id: 'productEquals',
              parameters: {product: 'Thunderbird'}
            },
            {
              id: 'activation',
              parameters: {activationDate: Date.now()}
            }
          ]
        };

        function test() {validation.validateRuleObject(rule);}
        expect(test).to.not.throw(Error);

      });

    });

    describe('when the rule is falsy', function() {

      it('should throw a BadContructorArgumentError', function() {

        var rule = false;
        function test() {validation.validateRuleObject(rule);}
        expect(test).to.throw(errors.BadContructorArgumentError);
        rule = null;
        function test2() {validation.validateRuleObject(rule);}
        expect(test2).to.throw(errors.BadContructorArgumentError);
        rule = undefined;
        function test3() {validation.validateRuleObject(rule);}
        expect(test3).to.throw(errors.BadContructorArgumentError);
      });

    });

    describe('when the rule is correct and have an idea', function() {

      it('should not throw an error', function() {

        var rule = {
          _id: '234367567234346665467',
          action: {
            id: 'latestForBranch',
            parameters: {branch: '17'}
          },
          predicates: [
            {
              id: 'productEquals',
              parameters: {product: 'Thunderbird'}
            },
            {
              id: 'activation',
              parameters: {activationDate: Date.now()}
            }
          ]
        };

        function test() {validation.validateRuleObject(rule);}
        expect(test).to.not.throw(Error);

      });

    });

    describe('when the rule predicates property', function() {

      describe('is missing', function() {

        it('should throw a BadPropertyTypeError', function() {
          var rule = {
            _id: '234367567234346665467',
            action: {
              id: 'latestForBranch',
              parameters: {branch: '17'}
            }
          };
          function test() {validation.validateRuleObject(rule);}
          expect(test).to.throw(errors.BadPropertyTypeError);
        });
      });

      describe('is an object', function() {

        it('should throw a BadPropertyTypeError', function() {
          var rule = {
            _id: '234367567234346665467',
            action: {
              id: 'latestForBranch',
              parameters: {branch: '17'}
            },
            predicates: {test: true}

          };
          function test() {validation.validateRuleObject(rule);}
          expect(test).to.throw(errors.BadPropertyTypeError);
        });
      });

      describe('is a string', function() {

        it('should throw a TypeError', function() {
          var rule = {
            _id: '234367567234346665467',
            action: {
              id: 'latestForBranch',
              parameters: {branch: '17'}
            },
            predicates: 'test'

          };
          function test() {validation.validateRuleObject(rule);}
          expect(test).to.throw(errors.TypeError);
        });
      });

    });

    describe('when the rule action property', function() {

      describe('is missing', function() {

        it('should throw a PropertyMissingError', function() {
          var rule = {
            _id: '234367567234346665467',
            predicates: [
              {
                id: 'productEquals',
                parameters: {product: 'Thunderbird'}
              },
              {
                id: 'activation',
                parameters: {activationDate: Date.now()}
              }
            ]
          };
          function test() {validation.validateRuleObject(rule);}
          expect(test).to.throw(errors.PropertyMissingError);
        });
      });

      describe('is null', function() {

        it('should throw a PropertyMissingError', function() {
          var rule = {
            _id: '234367567234346665467',
            action: null,
            predicates: [
              {
                id: 'productEquals',
                parameters: {product: 'Thunderbird'}
              },
              {
                id: 'activation',
                parameters: {activationDate: Date.now()}
              }
            ]
          };
          function test() {validation.validateRuleObject(rule);}
          expect(test).to.throw(errors.PropertyMissingError);
        });
      });

      describe('is true', function() {

        it('should throw a PropertyMissingError', function() {
          var rule = {
            _id: '234367567234346665467',
            action: true,
            predicates: [
              {
                id: 'productEquals',
                parameters: {product: 'Thunderbird'}
              },
              {
                id: 'activation',
                parameters: {activationDate: Date.now()}
              }
            ]
          };
          function test() {validation.validateRuleObject(rule);}
          expect(test).to.throw(errors.PropertyMissingError);
        });
      });

      describe('is an array', function() {

        it('should throw a PropertyMissingError', function() {
          var rule = {
            _id: '234367567234346665467',
            action: [],
            predicates: [
              {
                id: 'productEquals',
                parameters: {product: 'Thunderbird'}
              },
              {
                id: 'activation',
                parameters: {activationDate: Date.now()}
              }
            ]
          };
          function test() {validation.validateRuleObject(rule);}
          expect(test).to.throw(errors.PropertyMissingError);
        });
      });

    });

  });


  after(function() {
    mockery.deregisterAll();
    mockery.disable();
    mockery.resetCache();
  });
});

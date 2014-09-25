
'use strict';

var expect = require('chai').expect;

if (!process.env.CUSTOMERIO_ID || !process.env.CUSTOMERIO_KEY) {
  throw new Error('Set CUSTOMERIO_ID and CUSTOMERIO_KEY in your env.');
}

describe('the customerio-client module', function() {
  var CustomerIO;

  beforeEach(function() {
    CustomerIO = require('../customerio-client');
  });

  it('is a constructor function', function() {
    expect(CustomerIO).to.be.a('function');
  });

  it('takes a Customer.IO site key and secret', function() {
    expect(function() {
      new CustomerIO(
        process.env.CUSTOMERIO_ID,
        process.env.CUSTOMERIO_KEY
      );
    }).not.to.throw();

    expect(function() {
      new CustomerIO();
    }).to.throw();
  });

  describe('when properly configured', function() {
    var cio;
    beforeEach(function() {
      cio = new CustomerIO(
        process.env.CUSTOMERIO_ID,
        process.env.CUSTOMERIO_KEY
      );
    });

    describe('#identify', function() {
      it('requires a customer ID and email address', function() {

        var promise;

        expect(function() {
          cio.identify();
        }).to.throw();

        expect(function() {
          promise = cio.identify('XXX_TESTUSER_XXX', 'dev@null.com', {
            first_name: 'JOHN SMITH'
          });
        }).not.to.throw();

        return promise;
      });
    });

    describe('#track', function() {
      it('requires a customer ID, event name, and object with data to track', function() {

        var promise;

        expect(function() {
          cio.deleteUser();
        }).to.throw();

        expect(function() {
          promise = cio.track('XXX_TESTUSER_XXX', 'testevent', {
            foo: {
              bar: 'baz'
            }
          });
        }).not.to.throw();

        return promise;

      });
    });


    describe('#deleteUser', function() {
      it('requires a customer ID', function() {

        var promise;

        expect(function() {
          cio.deleteUser();
        }).to.throw();

        expect(function() {
          promise = cio.deleteUser('XXX_TESTUSER_XXX');
        }).not.to.throw();

        return promise;
      });
    });

  });
});

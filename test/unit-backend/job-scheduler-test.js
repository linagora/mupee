'use strict';

var chai = require('chai');

var expect = chai.expect;

var jobsScheduler = require('../../backend/job-scheduler');
var schedulerConfig = require('../../backend/config').scheduler;

describe('The Job Scheduler module', function() {
  var realMaxParallelTasks;
  var noopJob = function(done) {
    done();
  };

  var nextXTick = function(count, callback) {
    var i = 0;
    var runTick = function() {
      if (i === count) {
        return callback();
      }
      i++;
      process.nextTick(runTick);
    };
    runTick();
  };

  before(function() {
    realMaxParallelTasks = schedulerConfig.maxParallelTasks;
    schedulerConfig.maxParallelTasks = 3;
  });

  it('should be able to take a job', function(done) {
    jobsScheduler.addJob('test1', noopJob);
    expect(jobsScheduler.queuedJobsCount()).to.equal(1);
    nextXTick(2, done);
  });

  it('should run the job asynchronously, even if the job is synchronous', function(done) {
    jobsScheduler.addJob('test1', noopJob);
    expect(jobsScheduler.queuedJobsCount()).to.equal(1);
    nextXTick(2, done);
  });

  it('should not take 2 jobs with the same hash', function(done) {
    jobsScheduler.addJob('test1', noopJob);
    jobsScheduler.addJob('test1', noopJob);
    expect(jobsScheduler.queuedJobsCount()).to.equal(1);
    nextXTick(2, done);
  });

  it('should run the jobs', function(done) {
    var i = 0;
    function inc(done) {
      i++;
      done();
    }
    jobsScheduler.addJob('test1', inc);
    jobsScheduler.addJob('test2', inc);
    expect(jobsScheduler.queuedJobsCount()).to.equal(2);
    nextXTick(2, function() {
      expect(i).to.equal(2);
      expect(jobsScheduler.queuedJobsCount()).to.equal(0);
      expect(jobsScheduler.runningJobsCount()).to.equal(0);
      done();
    });
  });

  it('should not run more than config.scheduler.maxParallelTasks jobs in parallel', function(done) {
    var i = 0;
    function inc(done) {
      i++;
      done();
    }

    function tickAndInc() {
      return function(done) {
        nextXTick(2, function() {
          inc(done);
        });
      };
    }

    jobsScheduler.addJob('test1', tickAndInc());
    jobsScheduler.addJob('test2', tickAndInc());
    jobsScheduler.addJob('test3', tickAndInc());
    jobsScheduler.addJob('test4', tickAndInc());
    jobsScheduler.addJob('test5', tickAndInc());
    jobsScheduler.addJob('test6', tickAndInc());
    expect(jobsScheduler.queuedJobsCount()).to.equal(6);
    nextXTick(1, function() {
      expect(jobsScheduler.queuedJobsCount()).to.equal(3);
      expect(jobsScheduler.runningJobsCount()).to.equal(3);
    });
    nextXTick(6, function() {
      expect(i).to.equal(6);
      expect(jobsScheduler.queuedJobsCount()).to.equal(0);
      expect(jobsScheduler.runningJobsCount()).to.equal(0);
      done();
    });
  });

  after(function() {
    schedulerConfig.maxParallelTasks = realMaxParallelTasks;
  });

});

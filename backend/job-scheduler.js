'use strict';

var queuedJobs = {}, runningJobs = {}, consumeQueue;
var maxParallelJobs = require('./config').scheduler.maxParallelTasks;


function getLength(queue) {
  return Object.keys(queue).length;
}

function runningJobsCount() {
  return getLength(runningJobs);
}

function queuedJobsCount() {
  return getLength(queuedJobs);
}

function getFirstHash(queue) {
  var hashes = Object.keys(queue);
  if (hashes.length) {
    return hashes[0];
  }
  return null;
}

function launchJob(jobHash) {
  var job = queuedJobs[jobHash];
  delete queuedJobs[jobHash];
  runningJobs[jobHash] = job;
  job(function() {
    delete runningJobs[jobHash];
    process.nextTick(consumeQueue);
  });
}

consumeQueue = function() {
  if (runningJobsCount() >= maxParallelJobs) {
    return;
  }
  if (!queuedJobsCount()) {
    return;
  }
  launchJob(getFirstHash(queuedJobs));
};

function addJob(jobHash, job) {
  if (!jobHash || queuedJobs[jobHash] ||  runningJobs[jobHash]) {
    return false;
  }
  queuedJobs[jobHash] = job;
  process.nextTick(consumeQueue);
}

exports = module.exports = {
  addJob: addJob,
  runningJobsCount: runningJobsCount,
  queuedJobsCount: queuedJobsCount
};

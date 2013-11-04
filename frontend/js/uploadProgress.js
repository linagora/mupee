'use strict';

angular.module('mupeeUploadProgress', [])
  .directive('uploadProgress', function() {
      return {
        scope: true,
        controller: function($scope) {
          $scope.currentFileProgress = function(file) {
            return file.$progress().total / file.$progress().loaded;
          };

          $scope.globalFileProgress = function() {
            return $scope.progress().total / $scope.progress().loaded;
          };

          $scope.isAllFilesUploaded = function() {
            for (var i = 0; i < $scope.queue.length; i++) {
              if ($scope.queue[i].$submit) {
                return false;
              }
            }
            return true;
          };

          $scope.isCurrentFileUploaded = function(file) {
            return this.currentFileProgress(file) === 1;
          };
        }
      };
    });

'use strict';

angular.module('mupeeUploader', ['blueimp.fileupload', 'mupeeUploadProgress'])
    .config(['$httpProvider', 'fileUploadProvider', function($httpProvider, fileUploadProvider) {
      angular.extend(fileUploadProvider.defaults, {
        // options
      });
    }])
    .controller('MupeeFileUpload', ['$scope', '$http', '$filter', '$window', function($scope, $http) {
      var postUrl = '/admin/upload/extension';
      var getUrl = '/admin/extensions';
      $scope.uploadedFiles = [];

      $scope.options = {
        url: postUrl,
        method: 'POST',
        sequentialUploads: true,
        fail: function(e, data) {
          var fileIndex = $scope.queue.indexOf(data.files[0]);
          $scope.queue[fileIndex].error = data.errorThrown;
        },
        done: function(e, data) {
          var fileIndex = $scope.queue.indexOf(data.files[0]);
          $scope.uploadedFiles[fileIndex] = data.result;
          $scope.queue[fileIndex].$submit = null;
          $scope.queue[fileIndex].$cancel = null;
        }
      };

      $scope.loadingFiles = true;
      $http.get(getUrl)
        .then(
          function(response) {
            $scope.loadingFiles = false;
            response.data.forEach(function(xpi) {
              xpi.fileName = xpi.localFile.path.split('/').pop();
            });
            $scope.queue = response.data || [];
          },
          function() {
            $scope.loadingFiles = false;
          });
    }]);

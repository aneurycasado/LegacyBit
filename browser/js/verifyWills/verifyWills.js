app.config(function ($stateProvider) {
    $stateProvider.state('verifyWills', {
        url: '/verify-wills',
        templateUrl: 'js/verifyWills/verify.html',
        controller: function controller($scope, $state, UserInfo, WillInfo) {
          $scope.done = function(){
            $state.go("membersOnly");
          };
          $scope.wills = [];
          UserInfo.getSignedInUser().then(function (userInfo) {
              $scope.userInfo = userInfo;
              WillInfo.getAll().then(function(wills){
                wills.forEach(function(will){
                  if($scope.userInfo.user.name === will.verifierName){
                    $scope.wills.push(will);
                  }
                })
              });
          });
          $scope.verify = function(index){
            var currentWill = $scope.wills[index];
            WillInfo.verifyWill(currentWill._id).then(function(verifiedWill){
              WillInfo.deleteWill(verifiedWill._id).then(function(deletedWill){
                $state.go('membersOnly');
              });
            });
          }
        },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });
});

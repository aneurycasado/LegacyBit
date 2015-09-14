app.config(function ($stateProvider) {
    $stateProvider.state('currentWills', {
        url: '/current-wills',
        templateUrl: 'js/currentWills/current.html',
        controller: function controller($scope, $state, UserInfo, WillInfo) {
            $scope.done = function(){
              $state.go("membersOnly");
            };
            $scope.wills = [];
            UserInfo.getSignedInUser().then(function (userInfo) {
                $scope.userInfo = userInfo;
                WillInfo.getAll().then(function(wills){
                  wills.forEach(function(will){
                    if($scope.userInfo.user.name === will.originatorName){
                      $scope.wills.push(will);
                    }
                  })
                });
            });
        },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });
});

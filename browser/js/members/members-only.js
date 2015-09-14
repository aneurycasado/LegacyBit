app.config(function ($stateProvider) {
    $stateProvider.state('membersOnly', {
        url: '/members-area',
        templateUrl: 'js/members/members.html',
        controller: function controller($scope, $state, UserInfo) {
            UserInfo.getSignedInUser().then(function (userInfo) {
                console.log(userInfo);
                $scope.userInfo = userInfo;
            });
            $scope.goToWillCreation = function(){
              $state.go('createWill');
            };
            $scope.loadCurrentWills = function(){
              $state.go('currentWills');
            };
            $scope.loadVerifiyWills = function(){
              $state.go('verifyWills');
            };
        },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });
});

app.config(function ($stateProvider) {

    $stateProvider.state('createWill', {
        url: '/create-will',
        templateUrl: 'js/willCreator/willCreator.html',
        controller: function controller($scope, $state, $stateParams, WillInfo, UserInfo) {
            $scope.final = {
              beneficiary: null,
              verifier: null,
              current: null
            };
            $scope.validate = function(){
              UserInfo.getSignedInUser().then(function(currentUser){
                $scope.final.current = currentUser;
                UserInfo.getUser($scope.beneficiary.name).then(function(beneficiary){
                  if(!!beneficiary){
                    $scope.final.beneficiary = beneficiary;
                    UserInfo.getUser($scope.verifier.name).then(function(verifier){
                      if(!!verifier){
                        $scope.final.verifier = verifier;
                        var info = {
                          originatorAddress: $scope.final.current.user.address,
                          originatorPrivateKey: $scope.final.current.user.privateKey,
                          originatorName: $scope.final.current.user.name,
                          beneficiaryName: $scope.final.beneficiary.name,
                          beneficiaryAddress: $scope.final.beneficiary.address,
                          verifierName: $scope.final.verifier.name,
                          amount: $scope.amount
                        }
                        WillInfo.createWill(info).then(function(createdWill){
                          console.log(createdWill);
                          $state.go('membersOnly');
                        });
                      }else{
                        console.log("Verifier not in our database");
                      }
                    });
                  }else{
                    console.log("Beneficiary not in our database");
                  }
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

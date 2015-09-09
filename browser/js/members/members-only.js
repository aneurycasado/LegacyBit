app.config(function ($stateProvider) {

    $stateProvider.state('membersOnly', {
        url: '/members-area',
        template: '<h2>Cool</h2>',
        controller: function ($scope, SecretStash) {
            SecretStash.getStash().then(function (stash) {
                console.log(SecretStash.goToWillCreation.toString());
                $scope.stash = stash;
            });
            $scope.goToWillCreation = SecretStash.goToWillCreation;
        },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });

});

app.factory('SecretStash', function ($http) {

    var getStash = function () {
        return $http.get('/api/members/secret-stash').then(function (response) {
            return response.data;
        });
    };
    var goToWillCreation = function(){
      console.log('works');
    };
    return {
        getStash: getStash,
        goToWillCreation: goToWillCreation
    };

});

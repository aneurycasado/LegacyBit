app.factory('UserInfo', function ($http) {

    var getSignedInUser = function getStash() {
        return $http.get('/api/members/user-info').then(function (response) {
            if(response.data.coinbase){
              $http.get("/coinbase/getUser").then(function(data){
                console.log("User data");
                console.log(data);
              });
            }else{
              return response.data;
            }
        });
    };

    var getUser = function getUser(name){
      return $http.get('/api/members/'+name).then(function(response){
        return response.data;
      });
    }

    return {
        getSignedInUser: getSignedInUser,
        getUser: getUser
    };
});

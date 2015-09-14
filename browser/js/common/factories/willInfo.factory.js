app.factory('WillInfo', function ($http) {
    var createWill = function creatWill(info) {
        return $http.post('/api/will/create',info).then(function (response) {
            return response.data;
        });
    };

    var getAll = function(){
      return $http.get('/api/will/').then(function(response){
        return response.data;
      });
    };

    var verifyWill = function(id){
      return $http.get("/api/will/"+id).then(function(response){
        return response.data;
      });
    };

    var deleteWill = function(id){
      return $http.delete("/api/will/"+id).then(function(response){
        return response.data;
      });
    };

    return {
        createWill: createWill,
        getAll: getAll,
        verifyWill: verifyWill,
        deleteWill: deleteWill
    };
});

angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$http) {
	console.log("dash ctrl");
		$scope.todos = [{}];
		data1 = {'action': 'get'};
	$http.post('http://localhost/AngularLearning/process.php',data1).then(function(data) {
		//console.log(data.data.le);
		data = data.data;
                if (data.length == 0) {
                    console.log(data);
                    $scope.todos = data;
                    return;
                }
                data.forEach(function (entry) {
//                    console.log(entry);
                    if (entry.checked == "false") {
                        entry.checked = false;
                    } else {
                        entry.checked = true;
                    }
                    console.log(data);
                    $scope.todos = data;

                });
	
	//console.log($scope.data);
  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  });
  $scope.search ={
			newtodotext:''
		}
    $scope.submittodo = function () {
        var id = $scope.todos.length + 1;
        var todo = {
            'id': id,
            'title': $scope.search.newtodotext,
            'checked': false
        };
        $scope.search.newtodotext = "";
        $http({
            method: 'POST',
            url: 'http://localhost/AngularLearning/process.php',
            data: {
                'action': 'add',
                'mydata': todo
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
                .success(function (data) {
					data = data;
					console.log(data);
                    data.forEach(function (entry) {
//                    console.log(entry);
                        if (entry.checked == "false") {
                            entry.checked = false;
                        } else {
                            entry.checked = true;
                        }

                        $scope.todos = data;
                    });
                })
				.error(function(error){
					console.log("err"+err);
				});
				
    }
    $scope.change = function (todo) {
		console.log(todo.checked);
        if (todo.checked) {
            console.log("Unticked");
			// todo.checked = false;
        } else {
            console.log("Ticked");
            // todo.checked = true;
        }
        $http({
            method: 'POST',
            url: 'http://localhost/AngularLearning/process.php',
            data: {
                'action': 'markdone',
                'mydata': todo
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
                .success(function (data) {
                    console.log(data);
                    data.forEach(function (entry) {
                        if (entry.checked == "false") {
                            entry.checked = false;
                        } else {
                            entry.checked = true;
                        }
                        $scope.todos = data;
                    });
                });
    };
    $scope.editTodo = function (todo) {
        $scope.newtodotext = todo.title;
    }
    $scope.deleteTodo = function (id) {
        console.log(id);
        $http({
            method: 'POST',
            url: 'http://localhost/AngularLearning/process.php',
            data: {
                'action': 'delete',
                'mydata': id
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
                .success(function (data) {
                    if (data.length == 0) {
                        console.log(data);
                        $scope.todos = data;
                        return;
                    }
                    data.forEach(function (entry) {
                        if (entry.checked == "false") {
                            entry.checked = false;
                        } else {
                            entry.checked = true;
                        }

                        $scope.todos = data;

                    });
                });
    }

    $scope.doRefresh = function(){
        location.reload();
    }
    $scope.onHold = function(){
        alert("long");
    }
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

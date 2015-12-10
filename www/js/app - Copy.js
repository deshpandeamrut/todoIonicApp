var app = angular.module('myAngularApp', ['ngRoute', 'ngAnimate', 'ngAria', 'ngMaterial']);
app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
                when('/default', {
                    templateUrl: 'default.html',
                    controller: 'defaultController'
                }).
                when('/item1', {
                    templateUrl: 'item1.html',
                    controller: 'item1Controller'
                }).
                when('/item2', {
                    templateUrl: 'item2.html',
                    controller: 'item2Controller'
                }).
                when('/item3', {
                    templateUrl: 'item3.html',
                    controller: 'item3Controller'
                }).
                when('/item4', {
                    templateUrl: 'item4.html',
                    controller: 'item4Controller'
                }).
                when('/feed', {
                    templateUrl: 'feed.html',
                    controller: 'feedController'
                }).
                when('/post/:id?', {
                    templateUrl: 'post.html',
                    controller: 'postController'
                }).
                when('/todo', {
                    templateUrl: 'todo.html',
                    controller: 'todoController'
                }).
                otherwise({
                    redirectTo: '/default'
                });
    }]);

app.service('myService', function ($http) {
    var users = [];
//    var todos = [];
//    $http({
//        method: 'POST',
//        url: 'process.php',
//        data: {
//            'action': 'get'
//        },
//        headers: {
//            'Content-Type': 'application/x-www-form-urlencoded'
//        }
//    })
//            .success(function (data) {
//                data.forEach(function (entry) {
//                    console.log(entry);
//                    if (entry.checked == "false") {
//                        entry.checked = false;
//                    } else {
//                        entry.checked = true;
//                    }
//                    todos.push(entry);
//                });
//                return todos;
//            });
    this.addUser = function (user) {
        if (users.length == 0) {
            users.push(user);
        } else {
            users.forEach(function (u) {
                if (u.id == user.id) {
//               alert("present already");
                    return;
                } else {
//               alert("added");
                    users.push(user);
                }
            });
        }
        localStorage.setItem("userData", JSON.stringify(users));

    };
    this.getUsers = function () {
        users = JSON.parse(localStorage.getItem("userData"));
        return users;
    }
    this.popAlert = function (txt) {
        alert(txt);
    };
    var allPosts = [];
    this.addPosts = function (posts) {
        if (allPosts.length == 0) {
            posts.forEach(function (p) {
                allPosts.push(p);
            });
            return 1;
        }
        posts.forEach(function (p) {
            allPosts.forEach(function (p2) {
                if (p2.id == p.id) {
                    //already present
                } else {
                    allPosts.push(p);
                }
            });
        });
    };
    this.getPosts = function (posts) {
        return allPosts;
    };
    this.getPost = function (postId) {
        var post;
        allPosts.forEach(function (p) {
            if (p.id == postId) {
                post = p;
                return false;
            }
        });
        console.log(post);
        return post;
    }
    this.addTodo = function (todo, action) {
        if (action == "add") {
            console.log("added");
            todos.push(todo);
        } else if (action == "markdone") {
            todos.forEach(function (entry) {
                if (todo.id == entry.id) {
                    todo.checked = entry.checked;
                    console.log("marked/unmarked");
                }
            });
        }
    }
    this.getTodos = function () {
        return todos;
    }
    this.synchTodos = function (todos) {
        $http({
            method: 'POST',
            url: 'process.php',
            data: {
                'action': 'synchTodos',
                'todos': todos
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
                .success(function (data) {

                });
    }

});
app.controller('defaultController', function ($scope, myService) {
    $scope.imgsrc = "angular.jpg";
    makeMenuItemActive('#default');
});
app.controller('item1Controller', function ($scope, $rootScope, myService) {
//    $scope.data = dataObject;
    $scope.users = myService.getUsers();
    makeMenuItemActive('#ngRepeat');
});
app.controller('item2Controller', function ($scope, $rootScope) {
//    alert("item2 controller");
    $scope.inputData = "hello";
    $rootScope.data = $scope.inputData;
    makeMenuItemActive('#2way');
});
app.controller('item3Controller', function ($scope, $rootScope, myService) {
//    alert("item2 controller");
    $scope.addUser = function () {
        var user = {
            'id': $scope.id,
            'name': $scope.name,
            'company': $scope.company,
        };
        console.log(user);
        var status = myService.addUser(user);

    }
    makeMenuItemActive('#addUser');

});
app.controller('item4Controller', function ($scope, $rootScope, myService) {
//    alert("item2 controller");
    $scope.users = myService.getUsers();
    console.log($scope.users);
    makeMenuItemActive('#showUser');
});
app.controller('feedController', function ($scope, myService, $http) {
    $scope.posts = myService.getPosts();
    if ($scope.posts.length == 0) {
        var url = "http://nammabagalkot.in/category/news/?json=1";
        $http.get(url).success(function (response) {
            $scope.posts = response.posts;
            myService.addPosts($scope.posts);
        });
    }
    $scope.customNavigate = function (id) {
        alert(id);
    }
    makeMenuItemActive('#feed');
});
app.controller('postController', function ($scope, $routeParams, myService) {
    $scope.postId = $routeParams.id;
    $scope.post = myService.getPost($scope.postId);
    console.log("op: " + $scope.post);
});
app.controller('todoController', function ($scope, myService, $http, $timeout, $rootScope, $interval) {
    makeMenuItemActive('#todo');
    $scope.todos = [{}];
    $http({
        method: 'POST',
        url: 'process.php',
        data: {
            'action': 'get'
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
//                    console.log(entry);
                    if (entry.checked == "false") {
                        entry.checked = false;
                    } else {
                        entry.checked = true;
                    }
                    console.log(data);
                    $scope.todos = data;

                });

            });
    $scope.submittodo = function () {
        var id = $scope.todos.length + 1;
        var todo = {
            'id': id,
            'title': $scope.newtodotext,
            'checked': false
        };
        $scope.newtodotext = "";
        $http({
            method: 'POST',
            url: 'process.php',
            data: {
                'action': 'add',
                'mydata': todo
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
                .success(function (data) {
                    data.forEach(function (entry) {
//                    console.log(entry);
                        if (entry.checked == "false") {
                            entry.checked = false;
                        } else {
                            entry.checked = true;
                        }

                        $scope.todos = data;
                    });
                });
    }
    $scope.change = function (todo) {
        if (todo.checked) {
            console.log("Unticked");
        } else {
            console.log("Ticked");
            //todo.checked = true;
        }
        $http({
            method: 'POST',
            url: 'process.php',
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
            url: 'process.php',
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
});

makeMenuItemActive = function (currentMenuItem) {
    var menuItems = ['#ngRepeat', '#2way', '#addUser', '#showUser', '#feed', '#todo']
    menuItems.forEach(function (item) {
        if (currentMenuItem == item) {
            $(currentMenuItem).addClass("active");
        } else {
            $(item).removeClass('active');
        }
    });
}

app.filter('removeHtml', function () {
    return function (value) {
        var regex = /(<([^>]+)>)|&nbsp;| (\[&hellip;])|(#gallery.*\*\/)/ig;
        result = value.replace(regex, "");
        return result;
    };
});
app.factory("routingService", function($q) {
    return {
        "auth": function ($window, $location, direct) {
            if ($window.sessionStorage.length > 0) {
                if ($window.sessionStorage.getItem('position') != "null") {
                    $location.path(direct);
                }
                else { window.location.href = '../'; }
            } else {
                window.location.href = '../';
            }
        },
        "clear": function ($window, $location, direct, $sessionStorage) {
            $window.sessionStorage.clear();
            window.location.href = '../';
        },
        "accessToken": function () {
            console.log('ok');
            return false;
        }
    }
});

app.config(function($routeProvider, $locationProvider){
	'use strict';
	$locationProvider.hashPrefix('');
	$routeProvider
	.when('/', {
        resolve: {
            "check": function (routingService, $window, $location) {
                if ($window.sessionStorage.getItem('position') == "Manager")
                    return routingService.auth($window, $location, '/dashboard-manager');
                else if ($window.sessionStorage.getItem('position') == "Reporting Officer")
                    return routingService.auth($window, $location, '/dashboard-officer');
                else if ($window.sessionStorage.getItem('position') == "Officer")
                    return routingService.auth($window, $location, '/zone-management');
            }
        }
	})
    .when('/dashboard-manager', {
        resolve: {
            "check": function (routingService, $window, $location) {
                return routingService.auth($window, $location, '/dashboard-manager');
            }
        },
        templateUrl: '/dashboard-manager',
        controller: 'managerController',
        controllerAs: 'manager'
    })
    .when('/dashboard-officer', {
        resolve: {
            "check": function (routingService, $window, $location) {
                return routingService.auth($window, $location, '/dashboard-officer');
            }
        },
        templateUrl: '/dashboard-officer',
        controller: 'officerController',
        controllerAs: 'officer'
    })
    .when('/account-management', {
        resolve: {
            "check": function (routingService, $window, $location) {
                return routingService.auth($window, $location, '/account-management');
            }
        },
        templateUrl: '/account-management',
        controller: 'accountController',
        controllerAs: 'account'
    })
    .when('/account/:userID', {
        resolve: {
            "check": function (routingService, $window, $location, $route) {
                return routingService.auth($window, $location, '/account/' + $route.current.params.userID);
            }
        },
        templateUrl: function(params) {
            return '/account/' + params.userID;
        },
        controller: 'specificAccController',
        controllerAs: 'specificAcc'
    })
    .when('/role-management', {
        resolve: {
            "check": function (routingService, $window, $location) {
                return routingService.auth($window, $location, '/role-management');
            }
        },
        templateUrl: '/role-management',
        controller: 'roleController',
        controllerAs: 'role'
    })
    .when('/auth/:auth', {
        resolve: {
            "check": function (routingService, $window, $location, $route) {
                return routingService.auth($window, $location, '/auth/' + $route.current.params.auth);
            }
        },
        templateUrl: function(params) {
            return '/auth/' + params.auth;
        },
        controller: 'specificAuthController',
        controllerAs: 'specificAuth'
    })
//    .when('/driver-management', {
//        templateUrl: '/driver-management',
//        controller: 'driverController',
//        controllerAs: 'driver'
//    })
    .when('/truck-management', {
        resolve: {
            "check": function (routingService, $window, $location) {
                return routingService.auth($window, $location, '/truck-management');
            }
        },
        templateUrl: '/truck-management',
        controller: 'truckController',
        controllerAs: 'truck'
    })
//    .when('/truck/:truckID', {
//        templateUrl: function(params) {
//            return '/truck/' + params.truckID;
//        }
//    })
    .when('/zone-management', {
        resolve: {
            "check": function (routingService, $window, $location) {
                return routingService.auth($window, $location, '/zone-management');
            }
        },
        templateUrl: '/zone-management',
        controller: 'zoneController',
        controllerAs: 'zone'
    })
    .when('/area-management', {
        resolve: {
            "check": function (routingService, $window, $location) {
                return routingService.auth($window, $location, '/area-management');
            }
        },
        templateUrl: '/area-management',
        controller: 'areaController',
        controllerAs: 'area'
    })
    .when('/area/:areaID', {
        resolve: {
            "check": function (routingService, $window, $location, $route) {
                return routingService.auth($window, $location, '/area/' + $route.current.params.areaID);
            }
        },
        templateUrl: function (params) {
            return '/area/' + params.areaID
        },
        controller: 'thisAreaController',
        controllerAs: 'thisArea'
    })
    .when('/reporting', {
        resolve: {
            "check": function (routingService, $window, $location) {
                return routingService.auth($window, $location, '/reporting');
            }
        },
        templateUrl: '/reporting',
        controller: 'reportingController',
        controllerAs: 'reporting'
    })
    .when('/data-visualization', {
        resolve: {
            "check": function (routingService, $window, $location) {
                return routingService.auth($window, $location, '/data-visualization');
            }
        },
        templateUrl: '/data-visualization',
        controller: 'visualizationController',
        controllerAs: 'visualization'
    })
    .when('/acr-management', {
        resolve: {
            "check": function (routingService, $window, $location) {
                return routingService.auth($window, $location, '/acr-management');
            }
        },
        templateUrl: '/acr-management',
        controller: 'acrController',
        controllerAs:'acr'
    })
    .when('/notification', {
        resolve: {
            "check": function (routingService, $window, $location) {
                return routingService.auth($window, $location, '/notification');
            }
        },
        templateUrl: '/notification'
    })
    .when('/daily-report/:areaCode/:areaName', {
        resolve: {
            "check": function (routingService, $window, $location, $route) {
                return routingService.auth($window, $location, '/daily-report/' + $route.current.params.areaCode + '/' +$route.current.params.areaName);
            }
        },
        templateUrl: '/daily-report',
        controller: 'dailyController',
        controllerAs: 'daily'
    })
    .when('/bin-management',{
        resolve: {
            "check": function (routingService, $window, $location) {
                return routingService.auth($window, $location, '/bin-management');
            }
        },
        templateUrl: '/bin-management',
        controller: 'binController',
        controllerAs: 'bin'
    })
    .when('/view-report/:reportCode', {
        resolve: {
            "check": function (routingService, $window, $location, $route) {
                return routingService.auth($window, $location, '/view-report/' + $route.current.params.reportCode);
            }
        },
        templateUrl: function (params) {
            return '/view-report/' + params.reportCode;
        },
        controller:'viewReportController',
        controllerAs:'report'
    })
    .when('/edit-report/:reportCode',{
        resolve: {
            "check": function (routingService, $window, $location, $route) {
                return routingService.auth($window, $location, '/edit-report/' + $route.current.params.reportCode);
            }
        },
        templateUrl: function (params) {
            return '/edit-report/' + params.reportCode;
        },
        controller:'editReportController',
        controllerAs:'editReport'
    })
    .when('/logout', {
        resolve: {
            "clear": function (routingService, $window, $location) {
                return routingService.clear($window, $location, '/');
            }
        }
    })
    .otherwise({
        templateUrl: '/error',
        controller: 'errorController',
        controllerAs: 'error'
    });
});
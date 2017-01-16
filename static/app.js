var app = angular.module('testing', ['ui.router','ngMaterial','ngMessages']);

app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');
    
    $stateProvider
    .state('home', {
        url: '/',
        templateUrl: 'home.html',
        controller: 'homeController'
    })
});
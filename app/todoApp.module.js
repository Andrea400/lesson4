(function(angular) {

    'use strict';
    var module = angular.module('todoApp', ['ngMaterial']).config(['$mdThemingProvider', function($mdThemingProvider) {
    $mdThemingProvider.theme('myAwesome')
        .primaryPalette('green')
        .accentPalette('blue')
        .warnPalette('red');
    $mdThemingProvider.setDefaultTheme('myAwesome');
}])
})(angular);
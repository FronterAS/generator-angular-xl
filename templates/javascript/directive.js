'use strict';

angular.module('<%= scriptAppName %>')
    .directive('<%= cameledName %>', function () {

        var _linkFn = function link(scope, element, attrs) {
            element.text('this is the <%= cameledName %> directive');
        };

        return {
            restrict: 'A',
            link: _linkFn
        };
        
    });

(function () {
    'use strict';

    angular
        .module('todoApp')
        .directive('customList', customList);

    customList.$inject = [];

    function customList() {

        return {
            scope: {
                items: '=',
                selectedItem: '=',
                filterFunction: '=',
                categoria: '='
            },
            templateUrl: function (element, attribute) {
                console.log("prova: " + attribute.type);
                return 'app/components/' + attribute.type + '.template.html';
            },

            bindToController: true,
            controller: customListController,
            controllerAs: 'customListCtrl',

            restrict: 'A',

        };
    }


    customListController.$inject = ['storageService'];

    //Directive controller
    function customListController($scope, storageService) {
        var vm = this;
        vm.changePriority = changePriority;
        vm.checkStateChanged = checkStateChanged;
        vm.toggleSelection = toggleSelection;



        //Changes the priority of the given item
        function changePriority(item) {
            if (item.priority <= 0)
                item.priority++;
            else
                item.priority = -1;

            storageService.set(vm.items);
        }

        //Occurs when the status of an items changes
        function checkStateChanged() {
            storageService.set(vm.items);
        }

        //Select or deselect the given item
        function toggleSelection(item) {
            if (vm.selectedItem == null || vm.selectedItem != item)
                vm.selectedItem = item;
            else
                vm.selectedItem = null;
        }
    }
})();
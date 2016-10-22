(function () {
    'use strict';

    angular
        .module('todoApp')
        .directive('customList', customList)
        
    
        

    customList.$inject = ['storageService','$mdDialog','taskService'];

    function customList(storageService, $mdDialog, taskService) {

        return {
            scope: {
                 items: '=',
                //selectedItem: '=',
                filterFunction: '=',
                categoria: '=',
                listaCategorie: '=',
                imputSearch:'='
               
            },
            templateUrl: function (element, attribute) {
                return 'app/components/' + attribute.type + '.template.html';
            },

            bindToController: true,
            controller: customListController,
            controllerAs: 'customListCtrl',

            restrict: 'A',

        };
    }


    customListController.$inject = ['storageService','taskService','$mdDialog'];

    //Directive controller
    function customListController( storageService, taskService,  $mdDialog, $scope) {
        var vm = this;
        vm.changePriority = changePriority;
        vm.checkStateChanged = checkStateChanged;
        vm.toggleSelection = toggleSelection;
        vm.editItem = editItem;

         vm.selectedItems = [];
        
        vm.item;
        vm.deleteItem = deleteItem;
        vm.createItem = createItem;
        vm.editItem = editItem;
        vm.attuareFiltro = true;

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
            console.log("custionListCtrl: richiamata checkStateChanged ");
            console.log("custionListCtrl: salvataggio: " + vm.items);
            storageService.set(vm.items);
        }

        //Select or deselect the given item
        function toggleSelection(item) {
           var index = vm.selectedItems.indexOf(item);
           if(index!=-1){
               //l'elemento è già selezionato quindi lo deseleziono
               vm.selectedItems.splice(index,1);
           }else{
            // l'elemento non è ancora selezionato quindi lo seleziono
                vm.selectedItems.push(item);
           }
  console.log("elementi selezionati dopo: " + angular.toJson(vm.selectedItems));
        }
               
       
        //Delete the current selected item, if any
        function deleteItem(item,ev) {
            console.log("entrato in deleteItem" + item.title);
            if (item != null) {
                var confirm = $mdDialog.confirm()

                .textContent('The task "' + item.title + '" will be deleted. Are you sure?')
                    .ariaLabel('Delete task')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');

                $mdDialog.show(confirm).then(function(result) {
                    if (result) {
                        var index = vm.items.indexOf(item);
                        if (index != -1) {
                            vm.items.splice(index, 1);
                            storageService.set(vm.items);
                        }
                    }
                });
            }
        }


        function createItem(ev){
            taskService.showDialog(ev,vm.listaCategorie).then(function(i){
                if (i != null )
                {
                    vm.item = i;
                    vm.items.push(vm.item);
                    storageService.set(vm.items);
                }
            });
            
        }


        function editItem(item, ev){
            
            if (item != null) {
                taskService.showDialog(ev, vm.listaCategorie, item).then(function(i){
                if (i != null )
                {
                    var index = vm.items.indexOf(item);
                        if (index != -1) {
                            vm.items.splice(index, 1);
                            vm.items.push(i);

                            //storageService.set(vm.items);
                        }
                }
            });
            }
        }

        
    }







})();
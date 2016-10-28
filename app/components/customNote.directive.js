(function () {
    'use strict';

    angular
        .module('todoApp')
        .directive('customNote', customNote)
        
    
        

    customNote.$inject = ['storageService','$mdDialog','noteService'];

    function customNote(storageService, $mdDialog, noteService) {

        return {
            scope: {
                items: '=',
                type:'=',
                inputSearch:'=',
                cercaPer:'=',
            },
            templateUrl: function (element, attribute) {
                return 'app/components/' + attribute.type + '.template.html';
            },

            bindToController: true,
            controller: customNoteController,
            controllerAs: 'customNoteCtrl',

            restrict: 'E',

        };
    }


    customNoteController.$inject = ['storageService','noteService','$mdDialog'];

    //Directive controller
    function customNoteController( storageService, noteService,  $mdDialog, $scope) {
        var vm = this;
        vm.deleteItem = deleteItem;
        vm.createItem = createItem;
        vm.editItem = editItem;
        vm.toggleSelection = toggleSelection;
        vm.selectedItems =[];
      



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


         function deleteItem(ev) {
            if (vm.selectedItems != null && vm.selectedItems.length > 0) {
                var confirm = $mdDialog.confirm()

                .textContent('The selected tasks will be deleted. Are you sure?')
                    .ariaLabel('Delete tasks')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');

                $mdDialog.show(confirm).then(function(result) {
                    if (result) {
                        for (var i=0; i< vm.selectedItems.length; i++)
                        {
                            for (var x=0; x< vm.items.length; x++)
                            {
                                if(vm.items[x] == vm.selectedItems[i])
                                {                                 
                                    vm.items.splice(x, 1);
                                    //storageService.deleteTask(vm.selectedItems[i]);
                                    
                                }
                            }
                        }
                    console.log("vettore dopo l'eliminazione:" + angular.toJson(vm.items));
                    vm.selectedItems = [];
                    }
                });
            }
        }


        function createItem(ev){
            console.log("richiamato il createItem");
            noteService.showDialog(ev).then(function(i){
                if (i != null )
                {
                    vm.item = i;
                    //per il calcolo dell'id
                    if (vm.items.length > 0)
                    {
                        var val = vm.items[vm.items.length - 1];
                        vm.item.id= val.id +1;
                    }
                    else
                        vm.item.id = 1;

                    if(vm.item.data == null)
                        vm.item.data = new Date();
                    if(vm.item.tags == null)
                        vm.item.tags="";
                    vm.items.push(vm.item);
                    //storageService.storeTask(vm.item);
                    console.log("vettore dopo l'inserimento:" + angular.toJson(vm.items));
                    
                }
               
            });
            
        }


        function editItem(ev){
            var tmp;

            if (vm.selectedItems != null) {
                noteService.showDialog(ev, angular.copy(vm.selectedItems[0], tmp)).then(function(i){
                if (i != null )
                {
                    var index = vm.items.indexOf(vm.selectedItems[0]);
                        if (index != -1) {
                            vm.items[index].title = i.title;
                            vm.items[index].description = i.description;
                            vm.items[index].tags = i.tags;
                             vm.items[index].color = i.color;
                            if (i.data != null)
                                vm.items[index].data = i.data;
                            else
                                vm.items[index].data = vm.selectedItems[0].data;
                                
                            storageService.updateTask(vm.items[index]);
                            vm.selectedItems = [];
                        }
                }
            });
            }
        }

        
    




    }
})();
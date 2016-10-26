(function() {
    'use strict';

    angular
        .module('todoApp')
        .directive('categoryList', categoryList);

    categoryList.$inject = [];
    
    function categoryList() {
        return {
            scope: {},
            bindToController: {
                selectedItem: '=',
                view:'=',
                //selectedCategory:'=',
                inputSearch:'='
            
            },
            controller: categoryListController,
            controllerAs: 'categoryListCtrl',
            transclude: true,
            restrict: 'E',
            
            templateUrl: 'app/components/categoryList.template.html'
        };
    }


    categoryListController.$inject = ['storageService','$mdDialog'];

    //Directive controller
    function categoryListController(storageService, $mdDialog) {
        var vm = this;
        vm.items =  storageService.getTasks() || [];
        for(var i=0; i<vm.items.length; i++)
            vm.items[i].date = new Date(vm.items[i].date);
        
        vm.selectedCategory=null;
        vm.listaCategorie= storageService.getCategories();
        vm.selectedCategory = vm.listaCategorie[0];
        
        vm.selectCategory = selectCategory;
        vm.addCategory = addCategory;
        vm.removeCategory= removeCategory;
        vm.renameCategory = renameCategory;

        vm.notDone = "notDone";
        vm.done = "done";
        vm.all = "all";
         
        function selectCategory (nome)
        {
            console.log("Categoria selezionata: " + nome);
            vm.selectedCategory = nome;
        }
       
        function addCategory(ev){

                 var confirm = $mdDialog.prompt()
                .title('Add new Category')
                .placeholder('Your category title...')
                .ariaLabel('Your category title...')
                .targetEvent(ev)
                .ok('Add')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function(categoria) {
                if (categoria){

                            var temp={category: categoria};
                             if (vm.listaCategorie.length > 0)
                             {
                                var val = vm.listaCategorie[vm.listaCategorie.length - 1];
                                temp.id= val.id +1;
                             }
                    
                            else
                                temp.id = 1;
                            
                            var i=1;
                            
                            for(var x=0; x< vm.listaCategorie.length; x++)
                            {
                                if(vm.listaCategorie[x].category == temp.category)
                                {
                                    temp.category = categoria +i;
                                    i++;
                                }
                            }
                            
                            vm.listaCategorie.push(temp);
                            storageService.storeCategory(temp);
                }
                
            });
        }


        function renameCategory(ev){
            console.log("categoria selezionata: " + vm.selectedCategory);
            var index = vm.listaCategorie.indexOf(vm.selectedCategory);
            console.log("categoria esistente? : " + index);
            if(index!= -1)
            {   
                var confirm = $mdDialog.prompt()
                .title('Rename Category ' + vm.selectedCategory.category)
                .placeholder('Your category title...')
                .ariaLabel('Your category title...')
                .targetEvent(ev)
                .ok('Save')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function(categoria) {
                if (categoria){

                    var confirm = $mdDialog.confirm()
                    .textContent('The category "' + vm.selectedCategory.category + '" will be renamed to "' + categoria+ '". Are you sure?')
                    .ariaLabel('Rename category')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');

                $mdDialog.show(confirm).then(function(result) {
                    if (result) {
                        console.log("Nuovo nome:  " + categoria);
                        console.log("Vecchio nome: " + vm.selectedCategory.category);
                        var tmp = vm.selectedCategory.category;
                        var temp={category: categoria};
                        
                        var i=1;
                            
                        for(var x=0; x< vm.listaCategorie.length; x++)
                        {
                           if(vm.listaCategorie[x].category == temp.category)
                           {
                               temp.category = categoria +i;
                               i++;
                            }
                        }
                            
                        vm.listaCategorie[index].category=temp.category;
                        storageService.updateCategory(vm.listaCategorie[index]);
                      
                        // cambiare attr category a tutti i task della categoria modificata
                        for(var i in vm.items)
                        {
                            console.log("Vcchia category:  " +tmp );

                            if(vm.items[i].category.toLowerCase() == tmp.toLowerCase())
                            {
                                console.log("Task category:  " + vm.items[i].category.toLowerCase());
                                console.log("Nuova category:  " + vm.selectedCategory.category.toLowerCase());
                                vm.items[i].category =  temp.category;
                                console.log("nuovo task category:  " + vm.items[i].category);
               
                                storageService.updateTask(vm.items[i]);
                            }
                        }
                         console.log("finito:  " + angular.toJson(vm.listaCategorie));
                         console.log("LISTA_TASK:  " + angular.toJson(vm.items));
                      
                    }
                });
                           

                }
                
            });

            }
        }



        function removeCategory(ev){
            console.log("categoria selezionata: " + vm.selectedCategory);
            var index = vm.listaCategorie.indexOf(vm.selectedCategory);
            console.log("categoria esistente? : " + index);
            if(index!= -1)
            {

                 var confirm = $mdDialog.confirm()

                .textContent('The category "' + vm.selectedCategory.category + '" will be deleted. Are you sure?')
                    .ariaLabel('Delete category')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');

                $mdDialog.show(confirm).then(function(result) {
                    if (result) {
                        
                        vm.listaCategorie.splice(index,1);
                        clearCategory(vm.selectedCategory);
                        storageService.deleteCategory(vm.selectedCategory);
                        vm.selectedCategory=vm.listaCategorie[index-1];
                      
                    }
                });


            }

        }

       // fuzione che elimina tutti i task appartenenti ad una certa categoria
        function clearCategory(categoria)
        {
            console.log("elimino ogni singolo task appartenente alla categoria " + categoria.category);
            console.log("lunghezza vettore items: " + vm.items.length);
         
            
            for( var i=0; i<vm.items.length; i++)
            {
                var item = vm.items[i];
                
                if(item.category.toLowerCase() == categoria.category.toLowerCase())
                {
                    console.log("elimino task : " + item.title +  " perche appartiene alla categoria : " + categoria.category);
                      var index = vm.items.indexOf(item);
                      vm.items.splice(index,1);
                      storageService.deleteTask(item);
                      i--;
                }
            }
            console.log("lunghezza vettore items: " + vm.items.length);
            console.log("lunghezza vettore items: " + angular.toJson(vm.items));

        }

       
       
    }
})();
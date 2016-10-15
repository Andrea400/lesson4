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
                listaCategorie: '=',
                items: '=',
                selectedItem: '=',
                view:'=',
                selectedCategory:'=',
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
        vm.selectedCategory = vm.listaCategorie[0];
        vm.selectCategory = selectCategory;
        vm.addCategory = addCategory;
        vm.removeCategory= removeCategory;
       

        vm.notDone = notDone;
        vm.done = done;
        vm.all = all;
         
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

                            
                            var temp=categoria;
                            console.log("voglio inserire:  " + categoria);
                            var nonInserito= true;
                            var i=1;
                            while(nonInserito)
                            {
                                var index = vm.listaCategorie.indexOf(categoria);
                                console.log("la categoria:  " + categoria + "e' presente? " + index);
                                if(index==-1) // la categoria non e' gia' presente nella lista
                                {
                                    console.log("inserisco la Categoria:  " + categoria);
                                    vm.listaCategorie.push(categoria);
                                    nonInserito= false;
                                }
                                else{
                                        console.log("la categoria :  " + categoria + " esiste gia'");
                                        console.log("lista:  " + vm.listaCategorie);
                                        categoria = temp + i;
                                        console.log("incremento:  " + categoria);
                                        i++;
                                        
                                    }    
                            }
                            console.log("finito:  " + categoria);

                }
                
            });



        }

        function removeCategory(ev){
            console.log("categoria selezionata: " + vm.selectedCategory);
            var index = vm.listaCategorie.indexOf(vm.selectedCategory);
            console.log("categoria esistente? : " + index);
            if(index!= -1)
            {

                 var confirm = $mdDialog.confirm()

                .textContent('The task "' + vm.selectedCategory + '" will be deleted. Are you sure?')
                    .ariaLabel('Delete task')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');

                $mdDialog.show(confirm).then(function(result) {
                    if (result) {
                        
                        vm.listaCategorie.splice(index,1);
                        clearCategory(vm.selectedCategory);
                        vm.selectedCategory=vm.listaCategorie[index-1];
                      
                    }
                });


            }

        }

       // fuzione che elimina tutti i task appartenenti ad una certa categoria
        function clearCategory(categoria)
        {
            console.log("elimino ogni singolo task appartenente alla categoria " + categoria);
            console.log("lunghezza vettore items: " + vm.items.length);
            for( var i in vm.items)
            {
                var item = vm.items[i];
                if(item.title.toLowerCase() == categoria.toLowerCase())
                {
                    console.log("elimino task : " + item.title +  " perche appartiene alla categoria : " + categoria);
                      var index = vm.items.indexOf(item);
                      vm.items.splice(index,1);
                }
            }
            console.log("lunghezza vettore items: " + vm.items.length);
            console.log("lunghezza vettore items: " + angular.toJson(vm.items));
            storageService.set(vm.items);


        }

        function notDone(item) {
            return item.done == false;
        }

        function done(item) {
            return item.done == true;
        }

        function all(item) {
            return true;
        }
       
    }
})();
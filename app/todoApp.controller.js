(function(angular) {

    'use strict';
    //var module = angular.module('todoApp', ['ngMaterial']);

    angular.module('todoApp').controller('TodoController', TodoController);

TodoController.$inject = ['storageService','$mdDialog','taskService'];

    //This is the application controller
    function TodoController(storageService, $mdDialog, taskService ) {
        var vm = this;
        vm.search = false; //booleano per "barra Search"
        vm.toggleSearch = toggleSearch; // funzione per Show/hide barra search
        // variabile per view in formato lista o grid
        vm.view = 'apps'; // per cambiare view , "apps" per view lista, "list" per view grid (logica inversa)
        vm.setView = setView;        
        vm.inputSearch='';
         vm.cercaPer=''; // per affinare la ricerca
         //vm.vettoreCercaPer =["title","description","tag"]; // vettore di scelta "cerca per"
         vm.vettoreCercaPer = ("title description tag").split(' ').map(function (cerca) { return { abbrev: cerca }; });
      
         vm.noteTask = "Note"; // serve per cambiare view, si passa dalla "view note" alla "view task"
        vm.toggleNoteTask = toggleNoteTask;
       
        vm.listNote = storageService.getNotes() || []; // lista delle note,  comune a entrambe le view (list-grid) delle note
       
       
        // rende visivile/invisibile la barra-Search quando si preme l'apposita icona
        function toggleSearch(){
           
           if(vm.search) {
                vm.search=false;
                vm.inputSearch = '';
           }
           else 
                vm.search=true;
        }

        
        function toggleMenu(){
            
               if(vm.viewBar)
                     vm.viewBar=false;
                else
                    vm.viewBar=true;
           
        }

        //funzione per settare view (o list o grid)
        function setView()
        {
            if(vm.view== 'list')
                vm.view= 'apps';
            else
                vm.view= 'list';
        }
        
          function toggleNoteTask(){
           if(vm.noteTask== "Note")
                    vm.noteTask = "Task";
            else    
                vm.noteTask="Note";
       }

       
    }


})(window.angular);
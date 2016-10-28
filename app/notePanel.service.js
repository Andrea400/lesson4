(function(){
    'use strict';

    angular.module('todoApp')
            .service('noteService', noteService);

    noteService.$inject = ['$mdDialog'];

    function noteService($mdDialog){
                console.log("aperto il noteService.showDialog");
        this.showDialog = function (ev, item, multiple){
            return $mdDialog.show({
                controller: DialogController,
                controllerAs: 'dialogctrl',
                bindToController: {
                    item: 'vm.item',
                    mindate: 'vm.mindate',
                    multiple: 'vm.multiple',
                 
                },
                locals: {
                    item: item,
                    multiple: multiple,
                    color:  [{key: "white", value: "#ffffff"},
                             {key: "red", value: "#ff0000"},
                             {key: "green", value: "#00ff00"},
                             {key: "blue", value: "#0000ff"},
                             ]
                },
                templateUrl: 'app/panelNote.tmpl.html',
                clickOutsideToClose:true,
                targetEvent: ev
            })
            .then(function(answer){
                console.log("ANSwer: "+angular.toJson(answer));
                return answer;
            }, function (){
                console.log("Close modal");
            
            });
        };

    }


    

    function DialogController ($mdDialog, item,color, multiple)
    {
        var vm = this;
        vm.item = item;
        vm.multiple = multiple;
        vm.getMinDate = getMinDate;
        vm.hide = hide;
        vm.cancel = cancel;
        vm.answer = answer;
        vm.mydate = new Date();
        
        vm.mindate = getMinDate();
    
        function getMinDate()
        {
            if(vm.item == null)
                return (new Date(
                vm.mydate.getFullYear(),
                vm.mydate.getMonth(),
                vm.mydate.getDate()));

            else
                return new Date(vm.item.date);
        }

        function hide()
        {
            $mdDialog.hide();
        };

        function cancel()
        {
            console.log ("Multimple: "+vm.multiple);
            $mdDialog.cancel();
        };


        function answer(ans)
        {
            console.log("ANS: "+angular.toJson(ans));
            $mdDialog.hide(ans);
        };


    }
})();
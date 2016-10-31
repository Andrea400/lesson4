(function(){
    'use strict';

    angular.module('todoApp')
            .service('noteService', noteService);

    noteService.$inject = ['$mdDialog'];

    function noteService($mdDialog){
        this.showDialog = function (ev, item, multiple, edit){
            return $mdDialog.show({
                controller: DialogController,
                controllerAs: 'dialogctrl',
                bindToController: {
                    item: 'vm.item',
                    mindate: 'vm.mindate',
                    multiple: 'vm.multiple',
                    edit: 'vm.edit'
                 
                },
                locals: {
                    item: item,
                    multiple: multiple,
                    color:  [{key: "white", value: "#FFFFFF"},
                             {key: "red", value: "#FF9F71"},
                             {key: "green", value: "#82C168"},
                             {key: "blue", value: "#7FC2BC"},
                             {key: "yellow", value: "#FFFF80"}
                             ],
                    edit: edit
                },
                templateUrl: 'app/panelNote.tmpl.html',
                clickOutsideToClose:true,
                targetEvent: ev
            })
            .then(function(answer){
                return answer;
            }, function (){
            
            });
        };

    }


    

    function DialogController ($mdDialog, item,color, multiple, edit)
    {
        var vm = this;
        vm.item = item;
        vm.multiple = multiple;
        vm.edit = edit;
        vm.operation = getOperation();
        vm.getMinDate = getMinDate;
        vm.hide = hide;
        vm.cancel = cancel;
        vm.answer = answer;
        vm.mydate = new Date();
        
        vm.mindate = getMinDate();
        vm.getItemDate = getItemDate;
        vm.item2 = angular.copy(item) || {};
        vm.item2.date = getItemDate();

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

        function getItemDate()
        {
            if (vm.item == null)
                return vm.mindate;
            else
                return new Date(vm.item.date);
        }

        function getOperation()
        {
            if (multiple && edit)
                return "Multiple Note edit";
            if (edit && multiple == false)
                return "Single Note edit";
            if (vm.item == null)
                return "Note Creation";
            return "Note Details";
        }

        function hide()
        {
            $mdDialog.hide();
        };

        function cancel()
        {
            $mdDialog.cancel();
        };


        function answer(ans)
        {
            $mdDialog.hide(ans);
        };


    }
})();
(function () {
    'use strict';

    angular
        .module('todoApp')
        .filter('myFilter', MyFilter)

function MyFilter() {
  return function(data, lunghezza,category,done) {
    var result = [];
    var temp=[]
    if (angular.isArray(data) && (lunghezza.length==0))
    {

         //filtraggio per categoria
      angular.forEach(data, function(item) {
        if (item.category.toUpperCase() == category.toUpperCase() ) {
          temp.push(item);
        }
      });
        //filtro in funzione di done
        if(done=="all")
            result=temp;
        else if(done=="notDone")
        {
            angular.forEach(temp, function(item) {
                if (item.done==false) {
                result.push(item);
                }
            });
        }
        else if(done=="done")
        {
            angular.forEach(temp, function(item) {
                if (item.done==true) {
                result.push(item);
                }
            });
        }

      //console.log("vettore risultante filtro done: " + done + " e categoria: "+ category + " vet: " +angular.toJson(result));
       return result;

    }else if(angular.isArray(data) && lunghezza.length!=0)    
    {
        //non considero il filtraggio per done e per categoria e filtro in base al search
      angular.forEach(data, function(item) { 
        if (item.title.indexOf(lunghezza)!=-1) {
          result.push(item);
        }
      });
      //console.log("vettore risultante filtro search: " +angular.toJson(result));
      return result;
    }
  }
}
})();
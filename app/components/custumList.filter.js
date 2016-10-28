(function () {
    'use strict';

    angular
        .module('todoApp')
        .filter('myFilter', MyFilter)

function MyFilter() {
  return function(data, inputSerch,cercaPer, category,done) {
    var result = [];
    var temp=[]
    if (angular.isArray(data) && (inputSerch.length==0))
    {
          if(category != null && done!= null){ // filtro per i task

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
          }else { // filtro per le note
                result = data;
          }

      //console.log("vettore risultante filtro done: " + done + " e categoria: "+ category + " vet: " +angular.toJson(result));
       return result;

    }else if(angular.isArray(data) && inputSerch.length!=0)    
    {
        //non considero il filtraggio per done e per categoria e filtro in base al search
        console.log("cerca per: " +cercaPer);
        if(cercaPer!= null){

              if(cercaPer == "title"){ console.log("cerca per uguale a title " + cercaPer); 
                angular.forEach(data, function(item) { 
                    if (item.title.indexOf(inputSerch)!=-1) {
                      result.push(item);
                    }
                  });
              } else  if(cercaPer== "description"){
                angular.forEach(data, function(item) { 
                    if (item.description.indexOf(inputSerch)!=-1) {
                      result.push(item);
                    }
                  });
              }else  if(cercaPer== "tag"){
                angular.forEach(data, function(item) { 
                  for (var i in item.tags){
                    if (item.tags[i].indexOf(inputSerch)!=-1) {
                      result.push(item);
                      break;
                    }
                  }
                  });
              }
        }  else {
                     angular.forEach(data, function(item) { 
                    if (item.title.indexOf(inputSerch)!=-1) {
                      result.push(item);
                    }
                  });
                }  
      //console.log("vettore risultante filtro search: " +angular.toJson(result));
      return result;
    }
  }
}
})();
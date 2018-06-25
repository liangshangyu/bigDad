   var arr1 = [1,3,4,5]

    //简版实现

    function myFilter(arr,func) {
        var r = []
        for(var i=0;i<arr.length;i++){
            if(func(arr[i],i,arr)){  // typeof func(array[i]) !== 'undefined'
                r.push(arr[i])
            }
        }
        return r
    }
    
    let res = myFilter(arr1, function (n) {
        if(n % 2 === 1 ){
            return n
        }
    });
    console.log(res);
   if (!Array.prototype.filter) {
       Array.prototype.filter = function (callback) {
           var T
           if(this == null) {
               throw new TypeError ('this is undefined')
           }
           var O = Object(this)
           var len = O.length >>> 0
           if ( typeof callback !== 'function' ) {
               throw new TypeError (callback + 'is not a function')
           }
           var res = []
           if (arguments.length > 1){
               T = arguments[1]
           }
            for (var i=0; i<  len ;i++){
               if (i in O) {
                   var val = O[i]
                   if (callback.call(T, val, i, O)) {
                       res.push(val)
                   }
               }
            }
       }
   }
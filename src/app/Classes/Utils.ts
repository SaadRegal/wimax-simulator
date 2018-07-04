export class Utils {

  static isOdd(num) { return num % 2;}

  static random(min:number, max:number){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static rmv(doc,array){



    return array.filter(function(node) {
      if (node.id == doc.id) {
        return false;
      }
      return true;
    });

  }
  static countBy(userList:Array<User>, query:String){
    let count={
      RT:0,
      NRT:0,
      BE:0
    };
switch (query){
  case "type":{
    for(let user of userList){

      if(user.type=="RT"){
          count.RT++;
      }

      if(user.type=="NRT"){
        count.NRT++;
      }

      if(user.type=="BE"){
        count.BE++;
      }
    }
  }
}
return count;
  }



  static removeDuplicates(originalArray, prop) {
    let newArray = [];
    let lookupObject  = {};

    for(var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for(i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  static iniCycle(nbCycle){
    // let arr:Array<number>=[];
    // for(let i;i<=nbCycle;i++){
    //   i++;
    //   arr.push(i);
    // }
    // console.log(arr)
    // return arr
    const range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

    return range(0,nbCycle);
}



}


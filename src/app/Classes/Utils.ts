export class Utils {
  static random(min:number, max:number){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static rmv(doc,array){
    array.forEach( (item, index) => {
      if(item === doc) array.splice(index,1);
    });
  }
  static countByType(userList:Array<User>,query:String){
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

}
interface count {

}

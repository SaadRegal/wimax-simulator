export class Utils {
  static random(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static rmv(doc,array){
    array.forEach( (item, index) => {
      if(item === doc) array.splice(index,1);
    });
  }

}

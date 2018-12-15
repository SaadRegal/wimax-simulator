export class Utils {

  static isOdd(num) {
    return num % 2;
  }

  static random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static rmv(doc, array) {


    return array.filter(function (node) {
      return node.id !== doc.id;

    });

  }

  static countBy(userList: Array<User>, query: String) {
    const count = {
      RT: 0,
      NRT: 0,
      BE: 0
    };
    switch (query) {
      case 'type': {
        for (const user of userList) {

          if (user.type === 'RT') {
            count.RT++;
          }

          if (user.type === 'NRT') {
            count.NRT++;
          }

          if (user.type === 'BE') {
            count.BE++;
          }
        }
      }
    }
    return count;
  }


  static removeDuplicates(originalArray, prop) {
    const newArray = [];
    const lookupObject = {};

    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  static iniCycle(nbCycle) {
    const range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

    return range(0, nbCycle);
  }
}


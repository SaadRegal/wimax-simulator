import {Utils} from "./Utils";

// import {User} from './User';
export class BaseStation {
  usersList: Array<User> = [];
  waitingList: Array<User> = [];
  attempts: number;
  successUsersList: Array<User>;
  CDMALength: number;
  delay: number;
  cycles: number = 0;
  backOff: number;
  list: Array<number>;
  params: Params;
  stats: Stats;


  constructor() {

  }

  remakeCDMACode(user: User) {
    // console.warn('remaking')
    // let code =user.code;

    // if (code > 1 && code < this.params.CDMALimits.RT) {
    //   return Utils.random(1, this.params.CDMALimits.RT)
    // }
    // if (code > this.params.maxNbTrans.RT && code < this.params.CDMALimits.NRT) {
    //   return Utils.random(this.params.CDMALimits.RT, this.params.CDMALimits.NRT)
    // }
    // if (code > this.params.CDMALimits.NRT && code < this.params.CDMALimits.BE) {
    //   return Utils.random(this.params.CDMALimits.NRT, this.params.CDMALimits.BE)
    // }
    if (user.type == "RT") {
      return Utils.random(1, this.params.CDMALimits.RT)
    }
    if (user.type == "NRT") {
      return Utils.random(this.params.CDMALimits.RT, this.params.CDMALimits.NRT)
    }
    if (user.type == "BE") {
      return Utils.random(this.params.CDMALimits.NRT, this.params.CDMALimits.BE)
    }


  }

  genUsers() {

    for (let i = 0; i < this.params.nbOfUsers; i++) {

      let code = Utils.random(1, this.params.CDMALimits.BE);
      let props: Props = {maxNbTrans: 0, type: null};

      if (code >= 1 && code < this.params.CDMALimits.RT) {
        props.type = "RT";
      } else if (code > this.params.maxNbTrans.RT && code <= this.params.CDMALimits.NRT) {
        props.type = "NRT";
      } else {
        props.type = "BE";
      }

      let user: User = {
        id: i,
        code: code,
        backOff: 0,
        isInCollision: false,
        isSuccess: 'notYet',
        type: props.type,
        nbRTrans: 0
      };
      this.usersList.push(user);
    }
  }

  connectUsers() {
    this.genUsers();
    this.checkCollision();
  }


  checkCollision() {
    // let n = Utils.random(1, this.params.CDMALimits.BE);
    // for (let i = 0; i < n; i++) {

    // this.usersList.forEach((fv, fi, fArray) => {
    //   this.usersList.forEach((sv, si, sArray) => {
    //     if (fArray[fi].code == sArray[si].code) {
    //       this.usersList[fi].backOff--;
    //       this.usersList[fi].isInCollision = true;
    //
    //     } else {
    //       this.usersList[fi].isSuccess = true;
    //     }
    //   });
    // });
    //   for (let c=0 ; c<this.params.nbOfCycles;c++) {
    //     // let n = Utils.random(0, this.params.nbOfUsers);
    //     let n =600;
    //
    //     let start=n*c;
    //     let end= n*(c+1);
    //
    //   for (let userOne of this.usersList.slice(start,end)) {
    //
    //     for (let userTwo of this.usersList.slice(start,end)) {
    //       if (userOne.code == userTwo.code && userOne.id != userTwo.id) {
    //         if (userOne.backOff == 0) {
    //           // Change User code
    //           userOne.code = this.remakeCDMACode(userOne);
    //           if (userOne.type == "RT" && userOne.nbRTrans > this.params.maxNbTrans.RT) {
    //             userOne.isSuccess = false;
    //           } else if (userOne.type == "NRT" && userOne.nbRTrans > this.params.maxNbTrans.NRT) {
    //             userOne.isSuccess = false;
    //           } else if (userOne.type == "BE" && userOne.nbRTrans > this.params.maxNbTrans.BE) {
    //             userOne.isSuccess = false;
    //           }
    //           else {
    //             userOne.nbRTrans++;
    //             userOne.isInCollision = true;
    //             userOne.backOff = Utils.random(3,5);
    //             // userTwo.isSuccess = false;
    //           }
    //         } else if(userOne.backOff>0) {
    //          userOne.backOff--;
    //         }
    //       } else {
    //         userOne.isSuccess = true;
    //
    //
    //       }
    //     }
    //   }
    // }


    // for (let c = 0; c < this.params.nbOfCycles; c++) {
    // let n = Utils.random(0, this.params.nbOfUsers);
    // let n = 60;

    // let start = n * c;
    // let end = n * (c + 1);
    // let limit = Utils.random(0, this.usersList.length);
    // let end = Utils.random(0,this.usersList.length)

    // for (let userOne of this.usersList) {
    //   for (let userTwo of this.usersList) {
    //     if (userOne.code == userTwo.code && userOne.id != userTwo.id && userOne.isSuccess=='notYet') {
    //       if (userOne.backOff == 0 ) {
    //
    //         // Change User code
    //         userOne.code = this.remakeCDMACode(userOne);
    //         if (userOne.type == "RT" && userOne.nbRTrans > this.params.maxNbTrans.RT) {
    //           userOne.isSuccess = 'false';
    //         } else if (userOne.type == "NRT" && userOne.nbRTrans > this.params.maxNbTrans.NRT) {
    //           userOne.isSuccess = 'false';
    //         } else if (userOne.type == "BE" && userOne.nbRTrans > this.params.maxNbTrans.BE) {
    //           userOne.isSuccess = 'false';
    //         }
    //         else {
    //           console.log('retransmission');
    //           userOne.nbRTrans++;
    //           userOne.isInCollision = true;
    //           userOne.backOff = Utils.random(3, 5);
    //           // userTwo.isSuccess = false;
    //         }
    //       } else if (userOne.backOff > 0) {
    //         userOne.backOff--;
    //       }
    //     } else if (userOne.code != userTwo.code){
    //       userOne.isSuccess = 'true';
    //
    //
    //     }
    //   }
    // }


    // }
    // for (let userOne of this.usersList) {
    //   if (userOne.backOff>0){
    //     userOne.backOff--
    //   }
    //   for (let userTwo of this.usersList) {
    //     if(userOne.isSuccess=='notYet'){
    //       if(userOne.code == userTwo.code && userOne!=userTwo){
    //         userOne.isInCollision=true;
    //         userTwo.isInCollision=true;
    //         userOne.nbRTrans++;
    //         userTwo.nbRTrans++;
    //         if (userOne.nbRTrans>2){
    //           userOne.isSuccess='false';
    //         }
    //         if (userTwo.nbRTrans>2){
    //           userTwo.isSuccess='false';
    //         }
    //       }else {
    //         userOne.isSuccess='true';
    //       }
    //     }
    //   }
    //
    // }

    // }

    // }
    for (let c = 0; c < this.params.nbOfCycles; c++) {

      this.usersList.forEach((fv, fi, fArray) => {
        if (fArray[fi].backOff > 0) {
          fArray[fi].backOff--;
        } else if (fArray[fi].backOff==0) {
          this.usersList.forEach((sv, si, sArray) => {
            if (fArray[fi].code == sArray[si].code && fArray[fi].id != sArray[si].id && fArray[fi].isSuccess!='false') {

              if (this.isTimeout(fArray[fi])) {
                fArray[fi].isSuccess = 'false';
              } else {
                this.waitingList.push(fArray[fi]);
                Utils.rmv(fArray[fi],this.usersList)

                // fArray[fi].isInCollision = true;
                // fArray[fi].nbRTrans++;
                // fArray[fi].code = this.remakeCDMACode(fArray[fi]);
                // fArray[fi].backOff = Utils.random(3, 7);
              }

            } else if(fArray[fi].code != sArray[si].code) {
              this.usersList[fi].isSuccess = 'true';
            }
          });
        }
      });
    }
  }

  isTimeout(user: User) {
    if (user.type == "RT" && user.nbRTrans >= this.params.maxNbTrans.RT) {
      // user.isSuccess = 'false';
      return true;
    } else if (user.type == "NRT" && user.nbRTrans >= this.params.maxNbTrans.NRT) {
      // user.isSuccess = 'false';
      return true;
    } else if (user.type == "BE" && user.nbRTrans >= this.params.maxNbTrans.BE) {
      // user.isSuccess = 'false';
      return true;
    } else {
      return false
    }

  }

}

export interface Params {
  nbOfUsers: number,
  nbOfCycles: number,
  CDMALimits: {
    RT: number,
    NRT: number,
    BE: number
  },
  maxNbTrans: {
    RT: number,
    NRT: number,
    BE: number
  }
}

interface Props {
  maxNbTrans: number,
  type: String

}

interface Stats {
  cycle: number,
  user: {
    RT: { collisions, backOffs, attempts, success }
  }

}

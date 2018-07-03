import {Utils} from "./Utils";

export class BaseStation {
  usersList: Array<User> = [];
  waitingList: Array<User> = [];
  failedList: Array<User> = [];
  ongoingUsers: Array<User> = [];
  successUsers: Array<User> = [];
  attempts: number;
  backOff: number;
  params: Params;
  history: Array<{
    cycle: number,
    waiting: Array<User>,
    failed: Array<User>,
    success: Array<User>,
    collision: Array<User>,
  }> = [];
  collisionHistory: Array<User> = [];

  flatHistory:{
    collision:Array<User>,
    success:Array<User>,
    waiting:Array<User>,
    failed:Array<User>,
  }


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
      return Utils.random(this.params.CDMALimits.RT + 1, this.params.CDMALimits.NRT)
    }
    if (user.type == "BE") {
      return Utils.random(this.params.CDMALimits.NRT + 1, this.params.CDMALimits.BE)
    }


  }

  genUsers() {

    for (let i = 0; i < this.params.nbOfUsers; i++) {

      let code = Utils.random(
        1,
        Math.max(this.params.CDMALimits.BE,
          this.params.CDMALimits.NRT,
          this.params.CDMALimits.RT)
      );

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
        type: props.type,
        nbRTrans: 0
      };
      this.usersList.push(user);
    }
  }

  connectUsers() {
    this.genUsers();
    this.initHistory();
    this.checkCollision();

  }

  initHistory() {
    for (let i = 0; i < this.params.nbOfCycles; i++) {
      this.history.push({cycle: i, success: [], waiting: [], failed: [], collision: []});
    }
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



      // let start = position;
      // while (position <= this.usersList.length) {
      //   position = position + n;
      // }
      // let item = this.history.filter(item=>item.cycle==c);


      this.recordHistory(c);


//========== Processing Waiting list ==========
      for (let user of this.waitingList) {
        if (this.isTimeout(user)) {
          //If user is timedOut then it will be moved from waiting to failed
          this.failedList.push(user);
          this.waitingList = Utils.rmv(user, this.waitingList);

        } else {
          if (user.backOff > 0) {
            user.backOff--;
          } else if (user.backOff == 0) {
            //this mean the  user will attempt to communicate
            //so retransmission number will increase
            user.nbRTrans++;
            // Then it will be moved from waiting to ongoing users
            this.ongoingUsers.push(user);
            this.waitingList = Utils.rmv(user, this.waitingList);
          }
        }
      }

//========== Processing Successful list (!!not finished yet don't put it in report!!)==========
      //!!the Resource management not implemented yet so user will go straight to ongoing!!
      for (let user of this.successUsers) {
        if (1 == 1) {
          //If user didn't finished yet communication will be moved to ongoing users
          this.ongoingUsers.push(user);
          this.successUsers = Utils.rmv(user, this.successUsers);
        } else {
          //Since the user done communicating will be removed definitively
          this.successUsers = Utils.rmv(user, this.successUsers)
        }

      }



      // A new random number of the user list will as well want to communicate
      let n = Utils.random(0, Math.floor(this.usersList.length / 3));
      //So were moving them to ongoing
      this.ongoingUsers = this.usersList.slice(0, n);
      this.usersList = this.usersList.slice(n, this.usersList.length);

      // Now time to check for collisions
      for (let userOne of this.ongoingUsers) {
        for (let userTwo of this.ongoingUsers) {
          if (userOne.code == userTwo.code && userOne.id != userTwo.id) {
            //This means we have 2 different users have the same C.D.M.A code


            //this for statistics purposes
            this.collisionHistory.push(userOne);
            let item = this.history.filter(item => item.cycle == c);
            item[0].collision.push(userOne);


            //this mean the user has no longer a unique C.D.M.A code
            // so it will be removed from successful list
            this.successUsers = Utils.rmv(userOne, this.successUsers);

            //Now this user will take a random backOff and gets a new C.D.M.A code and moved to waiting
            userOne.backOff = Utils.random(3, 7);
            userOne.code = this.remakeCDMACode(userOne);
            this.waitingList.push(userOne);
            this.ongoingUsers = Utils.rmv(userOne, this.ongoingUsers);


          } else if (userOne.id != userTwo.id) {
            //Until now the user have a unique C.D.M.A code, so it will be copied to successful list
            this.usersList.push(userOne);

          }
        }
      }


    }

  }

  recordHistory(c) {
    let item = this.history.filter(item => item.cycle == c);
    item[0].waiting = item[0].waiting.concat(this.waitingList);
    item[0].failed = item[0].failed.concat(this.failedList);
    console.log(item)
  }

  renderHistoryData() {

  }

  isTimeout(user: User) {
    if (user.type == "RT" && user.nbRTrans >= this.params.maxNbTrans.RT) {
      return true;
    } else if (user.type == "NRT" && user.nbRTrans >= this.params.maxNbTrans.NRT) {
      return true;
    } else if (user.type == "BE" && user.nbRTrans >= this.params.maxNbTrans.BE) {
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
  },
  poolSize: number

}

interface Props {
  maxNbTrans: number,
  type: String

}


interface History {

  cycle: number,
  waiting: Array<User>,
  failed: Array<User>,
  success: Array<User>,

}

export interface Events {
  collisions: number,
  backOffs: number,
  attempts: number,
  success: number,
  canceled: number,
}

export interface Stats {
  user: {
    RT: Events,
    NRT: Events,
    BE: Events
  }
}

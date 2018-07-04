import {Utils} from "./Utils";

export class BaseStation {
  usersList: Array<User> = [];
  waitingList: Array<User> = [];
  failedList: Array<User> = [];
  ongoingUsers: Array<User> = [];
  successUsers: Array<User> = [];
  backOff: number;
  params: Params;
  resources: number;
  history: Array<{
    cycle: number,
    failed: Array<User>,
    success: Array<User>,
    collision: Array<User>,
    backOffs: Array<any>,
    reTrans: Array<User>,
  }> = [];

  flatHistory: {
    collision: Array<User>,
    success: Array<User>,
    backOff: Array<any>,
    failed: Array<User>,
    retransmission: Array<any>,
  } =
    {collision: [], success: [], backOff: [], failed: [], retransmission: []};




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

      let props: Props = {type: null, fileSize: 0};

      if (code >= 1 && code < this.params.CDMALimits.RT) {
        props.type = "RT";
        props.fileSize = 10;
      } else if (code > this.params.maxNbTrans.RT && code <= this.params.CDMALimits.NRT) {
        props.type = "NRT";
        //picking a random file size to download(between quarter poolSize and poolSize)
        props.fileSize = Utils.random(this.params.poolSize / 2, this.params.poolSize);
      } else {
        props.type = "BE";
        //picking a random file size to download(between quarter poolSize and poolSize same as NRT)
        props.fileSize = Utils.random(this.params.poolSize / 2, this.params.poolSize);
      }

      let user: User = {
        id: i,
        code: code,
        backOff: 0,
        type: props.type,
        nbRTrans: 0,
        isSuccess: false,
        fileSize: props.fileSize
      };
      this.usersList.push(user);
    }
  }

  connectUsers() {
    this.genUsers();
    this.initHistory();
    this.runCycles();

  }

  initHistory() {
    for (let i = 0; i < this.params.nbOfCycles; i++) {
      this.history.push({cycle: i, success: [], backOffs: [], failed: [], collision: [],reTrans:[]});
    }
  }

  runCycles() {

    for (let c = 0; c < this.params.nbOfCycles; c++) {
//========== Processing Waiting list ==========
      for (let user of this.waitingList) {
        if (this.isTimeout(user)) {

          //=====Fail Statistics =====
          //flat history
          this.flatHistory.failed.push(user);
          //Cycle History
          let item = this.history.filter(item => item.cycle == c);
          item[0].failed = item[0].failed.concat(this.failedList);
          //=====End Fail Statistics=====

          //If user is timedOut means it won't try to connect again
          //So it will be moved from waiting to failed
          this.failedList.push(user);
          this.waitingList = Utils.rmv(user, this.waitingList);
        } else {
          if (user.backOff > 0) {
            user.backOff--;
          } else if (user.backOff == 0) {
            //this means that  the  user will attempt to communicate
            //so retransmission number will increase
            user.nbRTrans++;
            //=====Retransmission Statistics======
            //flat history
            this.flatHistory.retransmission.push({type:user.type,nbRTrans:user.nbRTrans});
            //Cycle history
            let item = this.history.filter(item => item.cycle == c);
            item[0].reTrans.push(user);
            //=====End Retransmission Statistics======

            // Then it will be moved from waiting to ongoing users
            this.ongoingUsers.push(user);
            this.waitingList = Utils.rmv(user, this.waitingList);
          }
        }
      }

//========== Processing Successful list(Resources Management)==========
      this.resources = this.params.poolSize;
      //=====Success Statistics=====
      //Cycles history
      let item = this.history.filter(item => item.cycle == c);
      item[0].success = item[0].success.concat(this.successUsers);
      //=====End Success Statistics=====
      for(let user of this.successUsers){
        user.isSuccess = true;//Confirming success, so user won't get in collision again
        user.nbRTrans = 0;//resetting retransmission number
        //=====Success Statistics=====
        //Flat history
        this.flatHistory.success.push(user);
        //=====End Success Statistics=====
      }

      let count = Utils.countBy(this.successUsers, 'type');

      //******Managing RealTime ******
      for (let user of this.successUsers) {
        if (this.resources > 0) {
          if (user.type == 'RT') {
            this.resources = this.resources - 10;
          }
        }
        if (user.fileSize >= 0) {
          //If user didn't finished yet communication will be moved to ongoing users

          user.fileSize = user.fileSize - 10;
          // this.ongoingUsers.push(user);
          // this.successUsers = Utils.rmv(user, this.successUsers);
        } else {
          //Since the user done communicating will be removed definitively
          this.successUsers = Utils.rmv(user, this.successUsers)
        }

      }
      //****** Managing Non-RealTime & Best Effort ******
      for (let user of this.successUsers) {

        if (this.resources > 0) {
          if (user.type != 'RT') {
            if (user.fileSize >= 0) {
              let debit = (this.resources) / (count.BE + count.NRT);
              user.fileSize = user.fileSize - debit;
              this.resources = this.resources - debit;
              //If user didn't finished yet communication will be moved to ongoing users
              // this.ongoingUsers.push(user);
              // this.successUsers = Utils.rmv(user, this.successUsers);
            } else {
              //Since the user done communicating will be removed definitively
              this.successUsers = Utils.rmv(user, this.successUsers)
            }
          }
        }
      }


      // A new random number of the user list will as well want to communicate
      let n;
      // n = Utils.random(0, Math.floor(this.usersList.length));
      if(!Utils.isOdd(this.usersList.length)){
        n = Utils.random(0, Math.floor(this.usersList.length /2));
        // console.log('odd',this.usersList.length)
      }else {
        n = Utils.random(0,this.usersList.length);
        // console.log('even',this.usersList.length);
      }
      //So were moving them to ongoing
      this.ongoingUsers = this.usersList.slice(0, n);
      this.usersList = this.usersList.slice(n, this.usersList.length);

      // Now time to check for collisions
      let successCandidates:Array<User>=[];
      for (let userOne of this.ongoingUsers) {
        for (let userTwo of this.ongoingUsers) {
          if (userOne.code == userTwo.code && userOne.id != userTwo.id && !userOne.isSuccess) {
            //This means we have 2 different users have the same C.D.M.A code


            //=====Collision Statistics=====
            //Flat history
            this.flatHistory.collision.push(userOne);
            //Cycle history
            let item = this.history.filter(item => item.cycle == c);
            item[0].collision.push(userOne);
            //=====End Collision Statistics=====


            //this mean the user has no longer a unique C.D.M.A code
            // so it will be removed from successful list
            // this.successUsers = Utils.rmv(userOne, this.successUsers);
           successCandidates = Utils.rmv(userOne, successCandidates);

            //Now this user will take a random backOff and gets a new C.D.M.A code and moved to waiting

            let backOff= Utils.random(3, 7);
            userOne.backOff =backOff;
            //=====BackOff Statistics=====
            //flat history
            this.flatHistory.backOff.push({type:userOne.type,backOff:backOff});
            //Cycles history
            item = this.history.filter(item => item.cycle == c);
            item[0].backOffs.push({type:userOne.type,backOff:backOff});
            //=====End BackOff Statistics =====
            userOne.code = this.remakeCDMACode(userOne);
            this.waitingList.push(userOne);
            this.ongoingUsers = Utils.rmv(userOne, this.ongoingUsers);



          } else if (userOne.code != userTwo.code && userOne.id != userTwo.id) {
            //Until now the user have a unique C.D.M.A code, so it will be copied to successful list
            // this.successUsers.push(userOne);
            successCandidates.push(userOne);

          }
        }
      }
      successCandidates=Utils.removeDuplicates(successCandidates,'id');
      this.successUsers=this.successUsers.concat(successCandidates);



    }

  }

  recordHistory(c) {

    // let item = this.history.filter(item => item.cycle == c);
    // item[0].waiting = item[0].waiting.concat(this.waitingList);
    // item[0].failed = item[0].failed.concat(this.failedList);
    // console.log(item)
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
  type: String,
  fileSize: number

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
  reTransmission: number,
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

export interface FlatHistory {
  collision: Array<User>,
  success: Array<User>,
  backOff: Array<User>,
  failed: Array<User>,
  retransmission: Array<User>,
}

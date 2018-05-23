import {MathF} from "./MathF";

// import {User} from './User';
export class BaseStation {
  usersList: Array<User> = [];
  attempts: number;
  successUsersList: Array<User>;
  CDMALength: number;
  delay: number;
  cycles: number = 0;
  backOff: number;
  list: Array<number>;
  waitingList: Array<number>;
  params: Params;


  constructor() {

  }

  remakeCDMACode(user: User) {
    if (user.type == "RT") {
      return MathF.random(1, this.params.CDMALimits.RT)
    } else if (user.type == "NRT") {
      return MathF.random(this.params.CDMALimits.RT, this.params.CDMALimits.NRT)
    } else if (user.type == "BE") {
      return MathF.random(this.params.CDMALimits.NRT, this.params.CDMALimits.BE)
    }
  }

  genUsers() {

    for (let i = 0; i < this.params.nbOfUsers; i++) {

      let code = MathF.random(1, this.params.CDMALimits.BE);
      let props: Props = {maxNbTrans: 0, type: null};

      if (code > 1 && code < this.params.CDMALimits.RT) {
        props.type = "RT";
      }
      if (code > this.params.maxNbTrans.RT && code < this.params.CDMALimits.NRT) {
        props.type = "NRT";
      }
      if (code > this.params.CDMALimits.NRT && code < this.params.CDMALimits.BE) {
        props.type = "BE";
      }

      let user: User = {
        id: i,
        code: code,
        backOff: null,
        isInCollision: false,
        isSuccess: false,
        type: props.type,
        nbRTrans: 0
      };
      this.usersList.push(user);
    }
  }

  connectUsers() {
    this.genUsers();

    // for (let i = 0; i < this.params.nbOfIterations; i++) {
    this.checkCollision();


    // }

  }

  checkCollision() {
    // let n = MathF.random(1, this.params.CDMALimits.BE);
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

    for (let userOne of this.usersList) {

      for (let userTwo of this.usersList) {
        if (userOne.code == userTwo.code && userOne.id != userTwo.id) {
          if (userOne.backOff >= 0) {
            // Change User code
            userOne.code = this.remakeCDMACode(userOne);
            // userOne.code = this.remakeCDMACode(userOne);
            if (userOne.type == "RT" && userOne.nbRTrans > this.params.maxNbTrans.RT) {
              userOne.isSuccess = false;
            } else if (userOne.type == "NRT" && userOne.nbRTrans > this.params.maxNbTrans.NRT) {
              userOne.isSuccess = false;
            } else if (userOne.type == "BE" && userOne.nbRTrans > this.params.maxNbTrans.BE) {
              userOne.isSuccess = false;
            }

          } else {
            userOne.nbRTrans++;
            userOne.isInCollision = true;
          }
        } else {
          userOne.isSuccess = true;

        }
      }
    }
    // }

    // }

  }
}

export interface Params {
  nbOfUsers: number,
  nbOfIterations: number,
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
  nbOfBackOffs: number;
  nbOfCollisions: number;
  nbOfSuccess: number;
}

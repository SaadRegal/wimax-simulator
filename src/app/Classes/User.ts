class User {
  id: number;
  code: number;
  backOff: number = 0;
  isInCollision: Boolean;
  isSuccess: String;
  static backOff: number;
  type:String;
  nbRTrans:number;

  constructor(maxNbR: number) {

  }


}

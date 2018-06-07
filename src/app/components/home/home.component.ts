import {Component, OnInit} from '@angular/core';
import {BaseStation} from "../../Classes/BaseStation";
import {Params} from "../../Classes/BaseStation";
import {Events} from "../../Classes/BaseStation";
import {Stats} from "../../Classes/BaseStation";
import {Utils} from "../../Classes/Utils";
// import {BaseStation} from '../../Classes/BaseStation';

declare let $: any;
declare let Chart: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  params: Params = {
    nbOfUsers: 200,
    nbOfCycles: 900,
    CDMALimits: {
      RT: 75,
      NRT: 175,
      BE: 200
    },
    maxNbTrans: {
      RT: 2,
      NRT: 3,
      BE: 4
    },
    stats: {currentCycle: 1}
  };

  stats: Stats = {
    user: {
      RT: {collisions: 0, attempts: 0, backOffs: 0, success: 0, canceled: 0},
      NRT: {collisions: 0, attempts: 0, backOffs: 0, success: 0, canceled: 0},
      BE: {collisions: 0, attempts: 0, backOffs: 0, success: 0, canceled: 0}
    }
  };

  constructor() {
  }

  ngOnInit() {
    this.initUI();
    this.RunSimulation();
  }


  RunSimulation() {
    $("#dimmer").transition({
      animation:'fade in',
      // onHide: this.start(),
    });

    setTimeout(() => {
      this.start()
    }, 500);


  }
  start(){
    this.initResult();
    let bs = new BaseStation();
    bs.params = this.params;
    bs.connectUsers();
    for (let user of bs.usersList) {
      // console.log(user.isSuccess)

      if (user.isSuccess == 'false') {
        console.log(user.isSuccess)
      }
      // if (!user.isSuccess){console.log('succe')}
      // if (!user.isInCollision){console.log('boy')}
    }

    for (let user of bs.usersList) {
      // if(user.isSuccess=='true'){console.log(user.isSuccess)}
      // if (!user.isSuccess){console.log('yeah')}
      // if (!user.isInCollision){console.log('coll')}
    }

    for (let user of bs.usersList) {
      // if(user.isSuccess=='notYet'){console.log(user.isSuccess)}
      // if (!user.isSuccess){console.log('yeah')}
      // if (!user.isInCollision){console.log('coll')}
    }

    for (let user of bs.usersList) {
      // if(user.isInCollision){console.log('collisions',user.isInCollision)}
      // if (!user.isSuccess){console.log('yeah')}
      // if (!user.isInCollision){console.log('coll')}
    }

    // console.info('validating ...');
    // let c = 0;
    // for (let userOne of bs.usersList) {
    //   for (let userTwo of bs.usersList) {
    //     if (userOne.code == userTwo.code && userOne.id != userTwo.id) {
    //       // console.log(userOne.code,userOne,userTwo.code,userTwo)
    //       c++;
    //     }
    //   }
    // }
    // console.warn(c, 'collision');

    // console.log(bs.usersList);
    // console.log(bs.waitingList);
    // console.log(bs.failedList);
    this.initialStats(bs);
    $("#dimmer").transition('fade out');
  }

  initResult(){
    this.stats={
      user: {
        RT: {collisions: 0, attempts: 0, backOffs: 0, success: 0, canceled: 0},
        NRT: {collisions: 0, attempts: 0, backOffs: 0, success: 0, canceled: 0},
        BE: {collisions: 0, attempts: 0, backOffs: 0, success: 0, canceled: 0}
      }
    }
  }

  initialStats(bs: BaseStation) {
    let globalList: Array<User> = [];
    globalList = globalList.concat(bs.failedList, bs.usersList, bs.usersList);
    // for(let user of bs.usersList){
    //   globalList.push(user);
    // }
    // for(let user of bs.waitingList){
    //   globalList.push(user);
    // }
    // for(let user of bs.failedList){
    //   globalList.push(user);
    // }
    // console.log(globalList);
// Success count
//     for (let user of bs.usersList) {
//       if (user.type == 'RT') {
//         this.stats.user.RT.success++
//       }
//       if (user.type == 'NRT') {
//         this.stats.user.RT.success++
//       }
//       if (user.type == 'BE') {
//         this.stats.user.RT.success++
//       }
//     }

    let count = Utils.countByType(bs.failedList, "type");
    this.stats.user.RT.canceled = count.RT;
    this.stats.user.NRT.canceled = count.NRT;
    this.stats.user.BE.canceled = count.BE;

    count = Utils.countByType(bs.collisionHistory, "type");
    this.stats.user.RT.collisions = count.RT;
    this.stats.user.NRT.collisions = count.NRT;
    this.stats.user.BE.collisions = count.BE;

    count = Utils.countByType(bs.usersList, "type");
    this.stats.user.RT.success = count.RT;
    this.stats.user.NRT.success = count.NRT;
    this.stats.user.BE.success = count.BE;

    // backOff and attempts count
    for (let user of globalList) {

      if (user.type == 'RT') {
        this.stats.user.RT.attempts += user.nbRTrans;
        this.stats.user.RT.backOffs += user.backOff;
      }

      if (user.type == 'NRT') {
        this.stats.user.NRT.attempts += user.nbRTrans;
        this.stats.user.NRT.backOffs += user.backOff;
      }

      if (user.type == 'BE') {
        this.stats.user.BE.attempts += user.nbRTrans;
        this.stats.user.BE.backOffs += user.backOff;
      }

    }

  }


//UI
  displayInitStats(){
    $('.sidebar.bottom').transition('fade in');
    this.RunSimulation()
  }
  initUI() {
    // $('.ui.checkbox').checkbox();
    $("input[type='text']").on("focus",() =>{
      // $('.sidebar.bottom').sidebar({"dimPage":"false"}).sidebar('show');
      $('.sidebar.bottom').transition('fade in');
      let check=$('#rtSimulation').is(":checked");
      if(check){
        this.RunSimulation();
      }

    });




    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });


  }

  toggleTopBar() {
    $('.sidebar.top').sidebar({
      "transition": "scale out",
      "silent": "true"
    }).sidebar('show');

  }

  backToGraph() {
    $('.sidebar.top').sidebar({
      "transition": "scale out",
    }).sidebar('hide').sidebar({
      onHidden: $('.mainSegment').transition({
        animation: "fade out",
        onHidden: $('.charts').transition({duration: '1s'})
      })
      // .transition({
      // "onComplete":$('.charts').transition('fade in')
      // })
    });
  }


}

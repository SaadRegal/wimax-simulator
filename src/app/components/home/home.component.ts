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
    nbOfUsers: 201,
    nbOfCycles: 500,
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
    poolSize:180
  };

  stats: Stats = {
    user: {
      RT: {collisions: 0, reTransmission: 0, backOffs: 0, success: 0, canceled: 0},
      NRT: {collisions: 0, reTransmission: 0, backOffs: 0, success: 0, canceled: 0},
      BE: {collisions: 0, reTransmission: 0, backOffs: 0, success: 0, canceled: 0}
    }
  };


list=new Array([]);
  constructor() {
  }

  ngOnInit() {
    this.initUI();
    this.RunSimulation();
    this.renderCharts(this.stats);
    // this.test();
  }

  // test() {
  //   let users = [{name: "n1", id: 5}, {name: "n2", id: 6}, {name: "n2", id: 7,}, {name: "n2", id: 8}];
  //   // let user = {name: "n1", id: 5};
  //
  //   users=users.slice(1,2);
  //
  //   console.log(users);
  //
  //   // users = Utils.rmv(user, users);
  //
  // }


  RunSimulation() {
    $("#dimmer").transition({
      animation: 'fade in',
      // onHide: this.start(),
    });

    setTimeout(() => {
      this.start()
    },50);


  }

  start() {
    this.initResult();
    let bs = new BaseStation();
    bs.params = this.params;
    bs.connectUsers();
    this.initialStats(bs);
  }

  initResult() {
    this.stats = {
      user: {
        RT: {collisions: 0, reTransmission: 0, backOffs: 0, success: 0, canceled: 0},
        NRT: {collisions: 0, reTransmission: 0, backOffs: 0, success: 0, canceled: 0},
        BE: {collisions: 0, reTransmission: 0, backOffs: 0, success: 0, canceled: 0}
      }
    }
  }

  initialStats(bs: BaseStation) {

    // =====Statistics visualization=====

    //Failed
    let count = Utils.countBy(bs.flatHistory.failed, "type");
    this.stats.user.RT.canceled = count.RT;
    this.stats.user.NRT.canceled = count.NRT;
    this.stats.user.BE.canceled = count.BE;

    //Collisions
    count = Utils.countBy(bs.flatHistory.collision, "type");
    this.stats.user.RT.collisions = count.RT;
    this.stats.user.NRT.collisions = count.NRT;
    this.stats.user.BE.collisions = count.BE;

    //Success
    count = Utils.countBy(bs.flatHistory.success, "type");
    this.stats.user.RT.success = count.RT;
    this.stats.user.NRT.success = count.NRT;
    this.stats.user.BE.success = count.BE;




    // BackOff count
    for (let user of bs.flatHistory.backOff) {
      if (user.type == 'RT') {
        this.stats.user.RT.backOffs += user.backOff;
      }else

      if (user.type == 'NRT') {
        this.stats.user.NRT.backOffs += user.backOff;
      }else

      if (user.type == 'BE') {
        this.stats.user.BE.backOffs += user.backOff;
      }

    }

    // Retransmission count

    for (let user of bs.flatHistory.retransmission) {
      if (user.type == 'RT') {
        this.stats.user.RT.reTransmission += user.nbRTrans;
      }else

      if (user.type == 'NRT') {
        this.stats.user.NRT.reTransmission += user.nbRTrans;
      }else

      if (user.type == 'BE') {
        this.stats.user.BE.reTransmission += user.nbRTrans;
      }

    }



    $("#dimmer").transition('fade out');
  }


//UI
  displayInitStats() {
    $('.sidebar.bottom').transition('fade in');
    this.RunSimulation()
  }

  initUI() {
    // $('.ui.checkbox').checkbox();
    $("input[type='text']").on("focus", () => {
      // $('.sidebar.bottom').sidebar({"dimPage":"false"}).sidebar('show');
      $('.sidebar.bottom').transition('fade in');
      let check = $('#rtSimulation').is(":checked");
      if (check) {
        this.RunSimulation();
      }
    });

    $('.ui.dropdown').dropdown();


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
    this.renderCharts(this.stats)
  }

  renderCharts(stats) {

    let pie = $('.pieChart');

    let choices = $('#pieStatsChoice');
    let pieInitData = [0, 0, 0];


    let pieChart = new Chart(pie, {
      type: 'pie',
      data: {
        labels: ["RealTime", "Non RealTime", "Best Effort"],
        datasets: [{
          label: '# of Votes',
          data: pieInitData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
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
    let choice = "reTransmission";
    choices.change(function () {
      choice = this.value;

      switch (choice) {
        case ("success"): {
          pieChart.config.data.datasets[0].data=[stats.user.RT.success,stats.user.NRT.success,stats.user.BE.success];
          break;
        }
        case ("canceled"): {
          pieChart.config.data.datasets[0].data=[stats.user.RT.canceled,stats.user.NRT.canceled,stats.user.BE.canceled];
          break;
        }
        case ("backOff"): {
          pieChart.config.data.datasets[0].data=[stats.user.RT.backOffs,stats.user.NRT.backOffs,stats.user.BE.backOffs];
          break;
        }
        case ("reTransmission"): {
          pieChart.config.data.datasets[0].data=[stats.user.RT.reTransmission,stats.user.NRT.reTransmission,stats.user.BE.reTransmission];
          break;
        }
        default: {
          pieChart.config.data.datasets[0].data=[stats.user.RT.reTransmission,stats.user.NRT.reTransmission,stats.user.BE.reTransmission];
          break;
        }
      }
      pieChart.update();

    });




    let line = $('.lineChart');
    // let lineChart = new Chart(line, {
    //   type: 'bar',
    //   data: {
    //     labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    //     datasets: [{
    //       label: '# of Votes',
    //       data: [12, 19, 3, 5, 2, 3],
    //       backgroundColor: [
    //         'rgba(255, 99, 132, 0.2)',
    //         'rgba(54, 162, 235, 0.2)',
    //         'rgba(255, 206, 86, 0.2)',
    //         'rgba(75, 192, 192, 0.2)',
    //         'rgba(153, 102, 255, 0.2)',
    //         'rgba(255, 159, 64, 0.2)'
    //       ],
    //       borderColor: [
    //         'rgba(255,99,132,1)',
    //         'rgba(54, 162, 235, 1)',
    //         'rgba(255, 206, 86, 1)',
    //         'rgba(75, 192, 192, 1)',
    //         'rgba(153, 102, 255, 1)',
    //         'rgba(255, 159, 64, 1)'
    //       ],
    //       borderWidth: 1
    //     }]
    //   },
    //   options: {
    //     scales: {
    //       yAxes: [{
    //         ticks: {
    //           beginAtZero: true
    //         }
    //       }]
    //     }
    //   }
    // });


    let config = {
      type: 'line',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7'],
        datasets: [{
          label: 'RealTime',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255,99,132,1)',
          data: [5,8,9],
          fill: false,
        }, {
          label: 'Non RealTime',
          fill: false,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          data: [8,9,4
          ],
        }, {
          label: 'Best Effort',
          fill: false,
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderColor: 'rgba(255, 206, 86, 1)',
          data: [5,6,4
          ],
        }]

      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Chart.js Line Chart'
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Cycles'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Value'
            }
          }]
        }
      }
    };

    let lineChart =new Chart(line,config);





  }


}

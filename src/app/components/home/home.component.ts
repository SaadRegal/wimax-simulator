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
    nbOfCycles: 200,
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
  cycleStats:CycleStats={
    collision:{RT:[],NRT:[],BE:[]},
    failed:{RT:[],NRT:[],BE:[]},
    backOff:{RT:[],NRT:[],BE:[]},
    success:{RT:[],NRT:[],BE:[]},
  };


defZoom:number=this.params.nbOfCycles-Math.floor(this.params.nbOfCycles/1.2);
  constructor() {
  }

  ngOnInit() {
    this.initUI();
    this.RunSimulation();
    console.log(Utils.iniCycle(this.params.nbOfCycles))
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
    this.runCycleStats(bs);
  }

  initResult() {
    this.stats = {
      user: {
        RT: {collisions: 0, reTransmission: 0, backOffs: 0, success: 0, canceled: 0},
        NRT: {collisions: 0, reTransmission: 0, backOffs: 0, success: 0, canceled: 0},
        BE: {collisions: 0, reTransmission: 0, backOffs: 0, success: 0, canceled: 0}
      }
    };

    // this.cycleStats={
    //   collision:{RT:[],NRT:[],BE:[]},
    //   failed:{RT:[],NRT:[],BE:[]},
    //   backOff:{RT:[],NRT:[],BE:[]},
    //   success:{RT:[],NRT:[],BE:[]},
    // }
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


  runCycleStats(bs:BaseStation){
    for(let cycle of bs.history){
      let count=Utils.countBy(cycle.success,'type');
      this.cycleStats.success.RT.push(count.RT);
      this.cycleStats.success.NRT.push(count.NRT);
      this.cycleStats.success.BE.push(count.BE);

      count=Utils.countBy(cycle.collision,'type');
      this.cycleStats.collision.RT.push(count.RT);
      this.cycleStats.collision.NRT.push(count.NRT);
      this.cycleStats.collision.BE.push(count.BE);

      count=Utils.countBy(cycle.backOffs,'type');
      this.cycleStats.backOff.RT.push(count.RT);
      this.cycleStats.backOff.NRT.push(count.NRT);
      this.cycleStats.backOff.BE.push(count.BE);

      count=Utils.countBy(cycle.failed,'type');
      this.cycleStats.failed.RT.push(count.RT);
      this.cycleStats.failed.NRT.push(count.NRT);
      this.cycleStats.failed.BE.push(count.BE);
    }
// console.log(bs.history)
    console.log(this.cycleStats)
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

  goToGraph(type) {
    $('.sidebar.top').sidebar({
      "transition": "scale out",
    }).sidebar('hide').sidebar({
      onHidden: $('.mainSegment').transition({
        animation: "fade out",
        onHidden: $(type).transition({duration: '1s'})
      })
      // .transition({
      // "onComplete":$('.charts').transition('fade in')
      // })
    });


    this.renderCharts(this.stats,this.cycleStats,this.defZoom)
  }

  renderCharts(stats:Stats,cycleStats:CycleStats,zoom) {

    let pie = $('.pieChart');

    let pieChoices = $('#pieStatsChoice');
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
    let pieChoice = "reTransmission";
    pieChoices.change(function () {
      pieChoice = this.value;

      switch (pieChoice) {
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
    let config = {
      type: 'line',
      data: {
        labels: Utils.iniCycle(zoom),
        datasets: [{
          label: 'RealTime',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255,99,132,1)',
          data: cycleStats.success.RT,
          fill: false,
        }, {
          label: 'Non RealTime',
          fill: false,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          data: cycleStats.success.NRT,
        }, {
          label: 'Best Effort',
          fill: false,
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderColor: 'rgba(255, 206, 86, 1)',
          data: cycleStats.success.BE,
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
              labelString: 'Ongoing Communications',
            }
          }]
        }
      }
    };

    let lineCycleChart =new Chart(line,config);

    let lineCyclesChoices = $('#lineCyclesChoices');
    let lineCycleChoice = "success";
    lineCyclesChoices.change(function () {
      lineCycleChoice = this.value;
      console.log(this.value);

      switch (lineCycleChoice) {
        case ("success"): {

          lineCycleChart.config.data.datasets[0].data=cycleStats.success.RT;
          lineCycleChart.config.data.datasets[1].data=cycleStats.success.NRT;
          lineCycleChart.config.data.datasets[2].data=cycleStats.success.BE;
          lineCycleChart.options.scales.yAxes[0].scaleLabel.labelString='Ongoing Communications';


          break;
        }
        case ("failed"): {
          lineCycleChart.config.data.datasets[0].data=cycleStats.failed.RT;
          lineCycleChart.config.data.datasets[1].data=cycleStats.failed.NRT;
          lineCycleChart.config.data.datasets[2].data=cycleStats.failed.BE;
          lineCycleChart.options.scales.yAxes[0].scaleLabel.labelString='Failed Communications';
          break;
        }
        case ("backOff"): {
          lineCycleChart.config.data.datasets[0].data=cycleStats.backOff.RT;
          lineCycleChart.config.data.datasets[1].data=cycleStats.backOff.NRT;
          lineCycleChart.config.data.datasets[2].data=cycleStats.backOff.BE;
          lineCycleChart.options.scales.yAxes[0].scaleLabel.labelString='BackOffs Value';
          break;
        }
        case ("collision"): {
          lineCycleChart.config.data.datasets[0].data=cycleStats.collision.RT;
          lineCycleChart.config.data.datasets[1].data=cycleStats.collision.NRT;
          lineCycleChart.config.data.datasets[2].data=cycleStats.collision.BE;
          lineCycleChart.options.scales.yAxes[0].scaleLabel.labelString='Number of collisions';
          break;
        }
        default: {
          lineCycleChart.config.data.datasets[0].data=cycleStats.success.RT;
          lineCycleChart.config.data.datasets[1].data=cycleStats.success.NRT;
          lineCycleChart.config.data.datasets[2].data=cycleStats.success.BE;
          lineCycleChart.options.scales.yAxes[0].scaleLabel.labelString='Ongoing Communications';
          break;
        }
      }
      lineCycleChart.update();

    });



    let zoomValue = $('#zoomValue');
    zoomValue.change(function () {
      zoom = this.value;
      lineCycleChart.data.labels=Utils.iniCycle(zoom);
      lineCycleChart.update();

    });



  }


}

interface CycleStats {
  collision:{RT:Array<number>,NRT:Array<number>,BE:Array<number>},
  success:{RT:Array<number>,NRT:Array<number>,BE:Array<number>},
  failed:{RT:Array<number>,NRT:Array<number>,BE:Array<number>},
  backOff:{RT:Array<number>,NRT:Array<number>,BE:Array<number>},
}

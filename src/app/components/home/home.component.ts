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
    nbOfUsers: 300,
    nbOfCycles: 300,
    CDMALimits: {
      RT: 100,
      NRT: 200,
      BE: 300
    },
    maxNbTrans: {
      RT: 2,
      NRT: 3,
      BE: 4
    },
    poolSize:950
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
  bs:BaseStation;


defZoom:number=this.params.nbOfCycles-Math.floor(this.params.nbOfCycles/1.2);
  constructor() {
  }

  pieChart:any=null;
  lineCycleChart:any=null;

  ngOnInit() {
    this.initUI();
    this.RunSimulation();
  }


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
    this.bs = new BaseStation();
    this.bs.params = this.params;
    this.bs.connectUsers();
    this.initialStats();
    this.runCycleStats();
  }

  initResult() {
    this.stats = {
      user: {
        RT: {collisions: 0, reTransmission: 0, backOffs: 0, success: 0, canceled: 0},
        NRT: {collisions: 0, reTransmission: 0, backOffs: 0, success: 0, canceled: 0},
        BE: {collisions: 0, reTransmission: 0, backOffs: 0, success: 0, canceled: 0}
      }
    };

    this.cycleStats={
      collision:{RT:[],NRT:[],BE:[]},
      failed:{RT:[],NRT:[],BE:[]},
      backOff:{RT:[],NRT:[],BE:[]},
      success:{RT:[],NRT:[],BE:[]},
    }
  }

  initialStats() {

    // =====Statistics visualization=====

    //Failed
    let count = Utils.countBy(this.bs.flatHistory.failed, "type");
    this.stats.user.RT.canceled = count.RT;
    this.stats.user.NRT.canceled = count.NRT;
    this.stats.user.BE.canceled = count.BE;

    //Collisions
    count = Utils.countBy(this.bs.flatHistory.collision, "type");
    this.stats.user.RT.collisions = count.RT;
    this.stats.user.NRT.collisions = count.NRT;
    this.stats.user.BE.collisions = count.BE;

    //Success
    count = Utils.countBy(this.bs.flatHistory.success, "type");
    this.stats.user.RT.success = count.RT;
    this.stats.user.NRT.success = count.NRT;
    this.stats.user.BE.success = count.BE;




    // BackOff count
    for (let user of this.bs.flatHistory.backOff) {
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

    for (let user of this.bs.flatHistory.retransmission) {
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


  runCycleStats(){
    for(let cycle of this.bs.history){
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
  showBottomBar(){
    $('.sidebar.bottom').transition('fade in');
  }
  hideBottomBar(){
    $('.sidebar.bottom').transition('fade out');
  }
  displayInitStats() {
    this.showBottomBar();
    this.RunSimulation()
  }

  initUI() {
    // $('.ui.checkbox').checkbox();
    $("input[type='text']").on("change", () => {
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
        onHidden: $(type).transition({duration: '0.5s'})
      })
    });
    setTimeout(() => {
      this.hideBottomBar();
      this.renderCharts()
    },600);

  }

  backToHome(){
    $('.summarySegment ,.pieSegment,.lineSegment').transition({
      duration:'0.3s',
      animation:'vertical flip out',
    });

    setTimeout(() => {
      $('.mainSegment').transition({animation :'vertical flip  in',duration:'1s'})
    },301);
  }

  renderCharts() {
    // this.initResult();
    // this.initialStats();
    // this.runCycleStats();

    setTimeout(() => {

    },500);

 this.lineCycleChart=null;
  this.pieChart=null;

    let pie = $('.pieChart');


    let pieInitData = [this.stats.user.RT.success,this.stats.user.NRT.success,this.stats.user.BE.success];


    this.pieChart = new Chart(pie, {
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
    let pieChoices = $('#pieStatsChoice');
    pieChoices.change(()=> {
      pieChoice = $('#pieStatsChoice option:selected').val();
      // console.log()

      switch (pieChoice) {
        case ("success"): {
          this.pieChart.config.data.datasets[0].data=[this.stats.user.RT.success,this.stats.user.NRT.success,this.stats.user.BE.success];
          break;
        }
        case ("canceled"): {
          this.pieChart.config.data.datasets[0].data=[this.stats.user.RT.canceled,this.stats.user.NRT.canceled,this.stats.user.BE.canceled];
          break;
        }
        case ("backOff"): {
          this.pieChart.config.data.datasets[0].data=[this.stats.user.RT.backOffs,this.stats.user.NRT.backOffs,this.stats.user.BE.backOffs];
          break;
        }
        case ("reTransmission"): {
          this.pieChart.config.data.datasets[0].data=[this.stats.user.RT.reTransmission,this.stats.user.NRT.reTransmission,this.stats.user.BE.reTransmission];
          break;
        }
        default: {
          this.pieChart.config.data.datasets[0].data=[this.stats.user.RT.reTransmission,this.stats.user.NRT.reTransmission,this.stats.user.BE.reTransmission];
          break;
        }
      }
      this.pieChart.update();

    });


    let line = $('.lineChart');
    let config = {
      type: 'line',
      data: {
        labels: Utils.iniCycle(this.defZoom),
        datasets: [{
          label: 'RealTime',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255,99,132,1)',
          data: this.cycleStats.success.RT,
          fill: false,
        }, {
          label: 'Non RealTime',
          fill: false,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          data: this.cycleStats.success.NRT,
        }, {
          label: 'Best Effort',
          fill: false,
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderColor: 'rgba(255, 206, 86, 1)',
          data: this.cycleStats.success.BE,
        }]

      },
      options: {
        // responsive: true,
        title: {
          display: true,
          text: 'Chart.js Line Chart'
        },
        tooltips: {
          mode: 'index',
          intersect: true,
        },
        hover: {
          mode: 'nearest',
          // intersect: false
          animationDuration:1000
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

    this.lineCycleChart =new Chart(line,config);

    let lineCyclesChoices = $('#lineCyclesChoices');
    let lineCycleChoice = "success";
    lineCyclesChoices.change(()=>{
      lineCycleChoice = $('#lineCyclesChoices option:selected').val();

      switch (lineCycleChoice) {
        case ("success"): {

          this.lineCycleChart.config.data.datasets[0].data=this.cycleStats.success.RT;
          this.lineCycleChart.config.data.datasets[1].data=this.cycleStats.success.NRT;
          this.lineCycleChart.config.data.datasets[2].data=this.cycleStats.success.BE;
          this.lineCycleChart.options.scales.yAxes[0].scaleLabel.labelString='Ongoing Communications';


          break;
        }
        case ("failed"): {
          this.lineCycleChart.config.data.datasets[0].data=this.cycleStats.failed.RT;
          this.lineCycleChart.config.data.datasets[1].data=this.cycleStats.failed.NRT;
          this.lineCycleChart.config.data.datasets[2].data=this.cycleStats.failed.BE;
          this.lineCycleChart.options.scales.yAxes[0].scaleLabel.labelString='Failed Communications';
          break;
        }
        case ("backOff"): {
          this.lineCycleChart.config.data.datasets[0].data=this.cycleStats.backOff.RT;
          this.lineCycleChart.config.data.datasets[1].data=this.cycleStats.backOff.NRT;
          this.lineCycleChart.config.data.datasets[2].data=this.cycleStats.backOff.BE;
          this.lineCycleChart.options.scales.yAxes[0].scaleLabel.labelString='BackOffs Value';
          break;
        }
        case ("collision"): {
          this.lineCycleChart.config.data.datasets[0].data=this.cycleStats.collision.RT;
          this.lineCycleChart.config.data.datasets[1].data=this.cycleStats.collision.NRT;
          this.lineCycleChart.config.data.datasets[2].data=this.cycleStats.collision.BE;
          this.lineCycleChart.options.scales.yAxes[0].scaleLabel.labelString='Number of collisions';
          break;
        }
        default: {
          this.lineCycleChart.config.data.datasets[0].data=this.cycleStats.success.RT;
          this.lineCycleChart.config.data.datasets[1].data=this.cycleStats.success.NRT;
          this.lineCycleChart.config.data.datasets[2].data=this.cycleStats.success.BE;
          this.lineCycleChart.options.scales.yAxes[0].scaleLabel.labelString='Ongoing Communications';
          break;
        }
      }
      this.lineCycleChart.update();

    });



    let zoomValue = $('#zoomValue');
    zoomValue.change(()=> {
      this.defZoom = $('#zoomValue').val();
      this.lineCycleChart.data.labels=Utils.iniCycle(this.defZoom);
      this.lineCycleChart.update();

    });



  }


}

interface CycleStats {
  collision:{RT:Array<number>,NRT:Array<number>,BE:Array<number>},
  success:{RT:Array<number>,NRT:Array<number>,BE:Array<number>},
  failed:{RT:Array<number>,NRT:Array<number>,BE:Array<number>},
  backOff:{RT:Array<number>,NRT:Array<number>,BE:Array<number>},
}

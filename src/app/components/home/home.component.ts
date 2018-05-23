import {Component, OnInit} from '@angular/core';
import {BaseStation} from "../../Classes/BaseStation";
import {Params} from "../../Classes/BaseStation";
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
    nbOfUsers: 2000,
    nbOfIterations: 3,
    CDMALimits: {
      RT: 500,
      NRT: 1000,
      BE: 1500
    },
    maxNbTrans: {
      RT: 2,
      NRT: 3,
      BE: 4
    }
  };

  constructor() {
  }

  ngOnInit() {
    this.initUI();
    this.RunSimulation();

  }

  RunSimulation() {
    let bs = new BaseStation();
    bs.params = this.params;
    bs.connectUsers();
    for (let user of bs.usersList) {
      // console.log(user.isSuccess)
    }
    console.log(bs.usersList);
  }


//UI
  initUI() {
    $("input").on("focus", function () {
      // $('.sidebar.bottom').sidebar({"dimPage":"false"}).sidebar('show');
      $('.sidebar.bottom').transition('fade in')
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

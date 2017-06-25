<template>
  <transition name="fadeInLeft">
  <div id="container">
    <div id="bar" v-on:click="barClick">
      <i class="icon-animation el-icon-d-arrow-left" ></i>
    </div>
    <div id="dashboard">
      <div class="dashboard-data show">
        <ul class="dashboard-data-list">
          <li>
            Issues Time : <br><span>{{monthFormat(startTime)}}</span>
          </li>

          <li>
            Coupon Type : <br><span>{{typeFormat(type)}}</span>
          </li>

          <li>
            Vertical : <br><span>{{verticalFormat(vertical)}}</span>
          </li>

          <li v-bind:style="loadingOpacity" v-show="!chartShow">
            Coupon value : <br><span>{{value}}{{(type == 'fixed') ? ('') : ('%')}}</span>
          </li>

          <li v-bind:style="loadingOpacity" v-show="!chartShow">
            New User : <br><span>{{ FM_new }}%</span>
          </li>

          <li v-bind:style="loadingOpacity" v-show="!chartShow">
            Retained User : <br><span>{{ FM_reactivated }}%</span>
          </li>

          <li v-bind:style="loadingOpacity" v-show="!chartShow">
            Reactivated User : <br><span>{{FM_reactivated}}%</span>
          </li>

          <li>
            Test/Control : <br><span>{{test}}/{{control}}</span>
          </li>
        </ul>
        <div class="dashboard-chart-list" v-show="chartShow">
          <div class="chartItem">
            <div>
              RR
              <br>
              {{dashboardListData.rr}}%
            </div>
          </div>
          <div class="chartItem">
            <div>
              IGMB
              <br>
              {{dashboardListData.iGMB}}%
            </div>
          </div>
          <div class="chartItem">
            <div>
              IAB<br>
              {{dashboardListData.iAB}}%
            </div>
          </div>
          <div class="chartItem">
            <div>
              ROI<br>
              {{dashboardListData.roi}}%
            </div>
          </div>

        </div>
      </div>
      <div class="dashboard-canvas" v-bind:style="loadingOpacity" v-show="!chartShow">
        <p>
          <canvas id="Stage2" width="700" height="700"></canvas>
        </p>
        <p v-show="!chartReady">
          <i class="el-icon-loading"></i>
          <br>
          <span class="loading">loading</span>
        </p>
        <p v-show="chartReady">
          <!--<span class="ready" v-on:click="openChart('')">ready</span>-->
          <el-button class="ready" :plain="true" @click="openChart('')">ready</el-button>
        </p>
      </div>
      <div id="chartContainer" class="chartContainer" v-show="chartShow">
        <div id="cpName"><h2>{{cpName}}</h2></div>
        <div id="chartContext">
          <div id="chart0" class="chart">

          </div>
          <div id="chart1" class="chart">

          </div>
          <div id="chart2" class="chart">

          </div>
          <div id="chart3" class="chart">

          </div>
        </div>
        <div id="featuresControl">
          <div class="fcValue">Coupon Value : <br>
            <el-slider
              v-model="value"
              :min="5"
              :max="20"
              :step="5"
              show-stops>
            </el-slider>
          </div>
          <div class="fcValue">UserType(New:{{FM_new}}/Retained:{{FM_retained}}/Reactivated:{{FM_reactivated}}) :
            <br>
            <el-slider
              v-model="FM_range"
              :format-tooltip="formatTooltip"
              range
              :max="100">
            </el-slider>
          </div>
        </div>
      </div>
      <!--<div class="dashboard-chart-list" >-->
      <!--<div class="chartItem" v-on:click="openChart('RR')" v-bind:class="{ 'active': activeChart === 'RR' }">-->
      <!--<img v-bind:src="getImgUrl('RR')"/>-->
      <!--<div >-->
      <!--RR-->
      <!--</div>-->
      <!--</div>-->
      <!--<div class="chartItem" v-on:click="openChart('IGMB')"  v-bind:class="{ 'active': activeChart === 'IGMB' }">-->
      <!--<img v-bind:src="getImgUrl('IGMB')"/>-->
      <!--<div>-->
      <!--IGMB-->
      <!--</div>-->
      <!--</div>-->
      <!--<div class="chartItem" v-on:click="openChart('IAB')"  v-bind:class="{ 'active': activeChart === 'IAB' }">-->
      <!--<img v-bind:src="getImgUrl('IAB')"/>-->
      <!--<div>-->
      <!--IAB-->
      <!--</div>-->
      <!--</div>-->
      <!--<div class="chartItem" v-on:click="openChart('ROI')"  v-bind:class="{ 'active': activeChart === 'ROI' }">-->
      <!--<img v-bind:src="getImgUrl('ROI')"/>-->
      <!--<div>-->
      <!--ROI-->
      <!--</div>-->
      <!--</div>-->

      <!--</div>-->

    </div>
  </div>
  </transition>
</template>

<script>
  import CanvasService from '../js/3D';
  import Highcharts from '../js/HighChart-Theme';
  import JsonData from '../assets/data.json';
  import moment from 'moment';
  import $ from 'jquery';
  export default {
    name: 'chart',
    mounted(){
      // init  canvas
      let cs = this.canvasService = new CanvasService();
      let delta = Math.PI / 200;
      let canvas = document.getElementById("Stage2");
      let ctx = canvas.getContext("2d");
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#333";
      ctx.translate(350, 350);
      cs.drawCube(ctx);
      //add eventListener
      document.getElementById("Stage2").onmousedown = function (e) {
        let x0 = e.clientX;
        let y0 = e.clientY;
        document.onmousemove = function (e) {
          cs.rotateXAngle = cs.rotateXAngle + (y0 - e.clientY) * (Math.PI / (2 * cs.r));
          cs.rotateYAngle = cs.rotateYAngle - (x0 - e.clientX) * (Math.PI / (2 * cs.r));
          x0 = e.clientX;
          y0 = e.clientY;
          cs.drawCube(ctx);
        }
        document.onmouseup = function (e) {
          document.onmousemove = null;
        }
      };

      let timer = setInterval(function () {
        if (cs && canvas) {

          cs.rotateXAngle += delta;
          cs.rotateYAngle += delta;
          cs.rotateZAngle += delta;


          cs.drawCube(ctx);
        }
      }, 40);
          this.openChart();
    },
    watch: {
      toLeft(newVal, oldVal){
        if (newVal === true) {
          setTimeout(() => {
            this.toLeftDelay = true;
          }, 500);
        }
        else {
          this.toLeftDelay = false;
        }
      },
      toLeftDelay(newVal, oldVal){
        if (newVal === true) {
          setTimeout(() => {
            this.toLeftDelay2 = true;
          }, 500);
        }
        else {
          this.toLeftDelay2 = false;
        }
      },
      test(newVal, oldVal){
        if (newVal && newVal != oldVal) {
          this.control = 100 - newVal;
        }
      },
      control(newVal, oldVal){
        if (newVal && newVal != oldVal) {
          this.test = 100 - newVal;
        }
      },
      FM_new(newVal, oldVal){
        if (newVal && newVal != oldVal) {
          this.FM_reactivated = 100 - newVal - this.FM_retained;
        }
      },

      FM_retained(newVal, oldVal){
        if (newVal && newVal != oldVal) {
          this.FM_reactivated = 100 - newVal - this.FM_new;
        }
      },

      FM_reactivated(newVal, oldVal){
        if (newVal && newVal != oldVal) {
          this.FM_new = 100 - newVal - this.FM_retained;
        }
      },
      FM_range: {
        handler: function (val, oldVal) {
          if (this.toLeft && this.chartShow) {
            this.FM_new = val[0];
            this.FM_retained = val[1] - val[0];
            this.FM_reactivated = 100 - val[1];
            this.openChart()
          }
        },
        deep: true
      }
    },
    data(){
      let startTime = new Date();
      return {
        toLeft: false,
        toLeftDelay: false,
        toLeftDelay2: false,
        chartShow: false,
        loadingOpacity: {opacity: 1},
        chartOpacity: {opacity: 0},
        ctx: {},
        msg: 'Coupon Guru',
        cpName: "NewCoupon",
        monthShow: false,
        startTime: new Date(),
        typeShow: false,
        type: 'fixed',
        value: 5,
        valueShow: false,
        valueType: '',
        verticalShow: false,
        verticals: [
          {
            value: "O",
            label: "Core"
          },
          {
            value: 'B',
            label: 'Business & Industrial'
          }, {
            value: 'C',
            label: 'Collectibles'
          },
          {
            value: 'E',
            label: 'Electronics'
          },
          {
            value: 'F',
            label: 'Fashion'
          }, {
            value: 'L',
            label: 'Lifestyle'
          }, {
            value: 'M',
            label: 'Media'
          }, {
            value: 'P',
            label: 'Parts & Accessories'
          }],
        vertical: 'C',
        tcShow: false,
        test: 80,
        control: 20,
        fmShow: false,
        FM_new: 30,
        FM_retained: 30,
        FM_reactivated: 40,
        FM_range: [0, 0],
        chartReady: false,
        dashboardListData: {
          roi: 100,
          rr: 100,
          iAB: 100,
          iGMB: 100
        }
      }
    }
    ,
    methods: {
      monthFormat: (date) => {
        if (date && date instanceof Date) {

          return moment(date).format('YYYY-MM');
        }
        else {
          return '2017-06'
        }
      },
      typeFormat: (type) => {
        if (type === 'fixed') {
          return 'Amount Off'
        }
        else if (type === 'percent') {
          return 'Percentage Off'
        }
        return type;
      },
      verticalFormat: function (vertical) {
        if (!this.verticals) {
          return vertical
        }
        for (let i = 0; i < this.verticals.length; i++) {
          if (vertical == this.verticals[i].value) {
            return this.verticals[i].label;
          }
        }
        return vertical
      },
      openChart: function () {

        let data = this.dataFormat();
        let startTime_format = moment(this.startTime).format('YYYY-MM');
        this.dashboardListData.roi = data.roi.v[data.roi.d.indexOf(startTime_format)];
        this.dashboardListData.iAB = data.iAB.v[data.iAB.d.indexOf(startTime_format)];
        this.dashboardListData.iGMB = data.iGMB.v[data.iGMB.d.indexOf(startTime_format)];
        this.dashboardListData.rr = data.rr.v[data.rr.d.indexOf(startTime_format)];
        this.initHighchart('chart0', 'ROI', data.roi);
        this.initHighchart('chart1', 'IAB', data.iAB);
        this.initHighchart('chart2', "IGMB", data.iGMB);
        this.initHighchart('chart3', "RR", data.rr);
        if (!this.chartShow) {
          this.FM_range = [this.FM_new, (this.FM_retained + this.FM_new)];
          let _this = this;
          let t = setInterval(() => {
            if (_this.loadingOpacity.opacity <= 0) {
              _this.chartShow = true;
              _this.chartOpacity.opacity += 1 / 20;
              if (_this.chartOpacity.opacity >= 1) {
                clearInterval(t);
              }
            }
            else {
              _this.loadingOpacity.opacity -= 1 / 20;
            }
          }, 50);
        }
      },
      initHighchart: function (id, name, data) {
        Highcharts.chart(id, {

          title: {
            text: name
          },

          credits: {
            enabled: false
          },
          yAxis: {
            title: {
              text: 'percentage'
            },
          },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
          },

          xAxis: {
            categories: data.d,
            plotLines: [{
              color: 'red',            //线的颜色，定义为红色
              dashStyle: 'longdashdot',//标示线的样式，默认是solid（实线），这里定义为长虚线
              value: data.d.indexOf(moment(this.startTime).format('YYYY-MM')),                //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
              width: 2,                //标示线的宽度，2px
            }]
          },
          series: [{
            name: name,
            data: data.v
          }]

        });
      },
      barClick: function () {

//          $.ajax(
//            {
//              type:"POST",
//              url: 'http://10.249.75.145:8080/cpnGuru/cpnPerformance/predict',
//              data: JSON.stringify({
//                time: this.monthFormat(this.startTime),
//                type: this.type,
//                value: this.value,
//                vertical: this.vertical,
//                fmNew: this.FM_new,
//                fmRetained: this.FM_retained,
//                fmReactivated: this.FM_reactivated,
//                test: 80,
//                control: 20
//              }),
//              headers: {
//
//                'Accept': 'application/json',
//
//                'Content-Type': 'application/json'
//
//              },
//
//              dataType: "json",
//              success: function (data) {
//                console.log(data);
//                _this.chartReady = true;
//              }
//            }
//          );
        console.log(this.$router.push({path: '/'}))

      },
      formatTooltip: function (val) {
        let v = val;
        if (v === (this.FM_new + this.FM_retained)) {
          v = v - this.FM_new
        }
        return v;
      },
      dataFormat: () => {
        let json = {
          rr: {
            d: [],
            v: []
          }
          ,
          roi: {
            d: [],
            v: []
          }
          ,
          iGMB: {
            d: [],
            v: []
          }
          ,
          iAB: {
            d: [],
            v: []
          }

        };
        let items = ['rr', 'roi', 'iGMB', 'iAB'];
        for (let i = 0; i < items.length; i++) {
          let item = JsonData[items[i]];
          for (let dText in item) {
            let date = moment(dText).format('YYYY-MM');
            let value = item[dText];
            json[items[i]].d.push(date);
            json[items[i]].v.push(value);
          }
        }

        return json;
      }

    }
  }
</script>


<style scoped>

</style>

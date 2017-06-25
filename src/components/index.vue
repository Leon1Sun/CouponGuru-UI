<template>
  <transition name="fadeOutLeft">


  <div id="container">
    <div id="features">
      <div id="fHeader">
        <div id="fTitles">Coupon Guru</div>
        <div id="recommendation">
          <div>
            <input type="text" placeholder="Custom Name" class="cp-name" v-model="cpName">
          </div>
        </div>
      </div>
      <div id="context">
        <div id="pic">
          <img src="../assets/img/whiteWalker.jpg">
        </div>
        <div id="fDetails">

          <ul id="list1" class="featureList">
            <li>
              <!--Time-->
              <div class="detail-container">
                <div class="feature-detail-label">
                  <div>Issue Time:</div>
                  <i class="icon-animation" v-bind:class="[!monthShow ? 'el-icon-edit' : 'el-icon-check']"
                     @click="monthShow = !monthShow"></i>
                </div>
                <transition name="el-zoom-in-bottom">

                  <div class="feature-detail-value" v-show="!monthShow">
                    {{monthFormat(startTime)}}
                  </div>
                </transition>
                <transition name="el-zoom-in-bottom">
                  <el-date-picker v-show="monthShow" class="feature-detail-edit"
                                  v-model="startTime"
                                  format="yyyy-MM-dd"
                                  type="month"
                                  placeholder="Start Time"
                                  @change="monthShow = !monthShow">
                  </el-date-picker>
                </transition>
              </div>
            </li>
            <li>
              <!--conpon type-->
              <div class="detail-container">
                <div class="feature-detail-label">
                  <div>Coupon Type :</div>
                  <i class="icon-animation" v-bind:class="[!typeShow ? 'el-icon-edit' : 'el-icon-check']"
                     @click="typeShow = !typeShow"></i>
                </div>
                <transition name="el-zoom-in-bottom">

                  <div class="feature-detail-value" v-show="!typeShow">
                    {{typeFormat(type)}}
                  </div>
                </transition>
                <transition name="el-zoom-in-bottom">
                  <el-select v-model="type" v-show="typeShow" class="feature-detail-edit" placeholder="Value Type">
                    <el-option
                      key="Amount off"
                      label="Amount Off"
                      value="fixed">
                    </el-option>
                    <el-option
                      label="Percentage Off"
                      key="Percentage Off"
                      value="percent">
                    </el-option>
                  </el-select>
                </transition>
              </div>
              <!--conpon value-->
              <div class="detail-container">
                <div class="feature-detail-label">
                  <div>Coupon Value :</div>
                  <!--<i class="icon-animation" v-bind:class="[!valueShow ? 'el-icon-edit' : 'el-icon-check']"-->
                  <!--@click="valueShow = !valueShow"></i>-->
                </div>
                <transition name="el-zoom-in-bottom">

                  <div class="feature-detail-value" v-show="!typeShow">
                    {{value}}{{(type == 'fixed') ? ('') : ('%')}}
                  </div>
                </transition>
                <transition name="el-zoom-in-bottom">
                  <el-input-number class="feature-detail-edit" v-show="typeShow" v-model="value"
                                   :step="5"></el-input-number>
                </transition>
              </div>
            </li>
            <li>
              <!--vertical-->
              <div class="detail-container">
                <div class="feature-detail-label">
                  <div>Vertical:</div>
                  <i class="icon-animation" v-bind:class="[!verticalShow ? 'el-icon-edit' : 'el-icon-check']"
                     @click="verticalShow = !verticalShow"></i>
                </div>
                <transition name="el-zoom-in-bottom">

                  <div class="feature-detail-value" v-show="!verticalShow">
                    {{verticalFormat(vertical)}}
                  </div>
                </transition>
                <transition name="el-zoom-in-bottom">
                  <el-select v-model="vertical" v-show="verticalShow" class="feature-detail-edit"
                             @change="verticalShow = !verticalShow"
                             placeholder="Value Type">
                    <el-option
                      v-for="item in verticals"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </transition>
              </div>
            </li>
          </ul>
          <ul id="list2" class="featureList">
            <li>
              <div class="detail-container">
                <div class="feature-detail-label">
                  <div>User Type :</div>
                  <i class="icon-animation" v-bind:class="[!fmShow ? 'el-icon-edit' : 'el-icon-check']"
                     @click="fmShow = !fmShow"></i>
                </div>
              </div>
              <div class="detail-container">
                <div class="feature-detail-label-sub">
                  <div> - New :</div>
                </div>
                <transition name="el-zoom-in-bottom">

                  <div class="feature-detail-value" v-show="!fmShow">
                    {{ FM_new
                    }}%
                  </div>
                </transition>
                <transition name="el-zoom-in-bottom">
                  <el-input-number class="feature-detail-edit" v-show="fmShow" v-model="FM_new" :step="1" :min="0"
                                   :max="100"></el-input-number>
                </transition>
              </div>

              <div class="detail-container">
                <div class="feature-detail-label-sub">
                  <div>- Retained :</div>
                </div>
                <transition name="el-zoom-in-bottom">

                  <div class="feature-detail-value" v-show="!fmShow">
                    {{ FM_retained
                    }}%
                  </div>
                </transition>
                <transition name="el-zoom-in-bottom">
                  <el-input-number class="feature-detail-edit" v-show="fmShow" v-model="FM_retained" :step="1" :min="0"
                                   :max="100"></el-input-number>
                </transition>
              </div>

              <div class="detail-container">
                <div class="feature-detail-label-sub">
                  <div>- Reactivated :</div>
                </div>
                <transition name="el-zoom-in-bottom">

                  <div class="feature-detail-value" v-show="!fmShow">
                    {{ FM_reactivated
                    }}%
                  </div>
                </transition>
                <transition name="el-zoom-in-bottom">
                  <!--<el-input-number class="feature-detail-edit" v-show="fm1Show" v-model="value" :step="5"></el-input-number>-->
                  <el-input-number class="feature-detail-edit" v-show="fmShow" v-model="FM_reactivated" :step="1"
                                   :min="0"
                                   :max="100"></el-input-number>
                </transition>
              </div>
            </li>
          </ul>
          <ul id="list3" class="featureList">
            <li>
              <div class="detail-container">
                <div class="feature-detail-label">
                  <div>Test/Control :</div>
                  <i class="icon-animation" v-bind:class="[!tcShow ? 'el-icon-edit' : 'el-icon-check']"
                     @click="tcShow = !tcShow"></i>
                </div>
              </div>
              <div class="detail-container">
                <div class="feature-detail-label-sub">
                  <div> - Test :</div>
                </div>
                <transition name="el-zoom-in-bottom">

                  <div class="feature-detail-value" v-show="!tcShow">
                    {{ test }}%
                  </div>
                </transition>
                <transition name="el-zoom-in-bottom">
                  <el-input-number class="feature-detail-edit" v-show="tcShow" v-model="test" :step="1" :min="50"
                                   :max="100"></el-input-number>
                </transition>
              </div>

              <div class="detail-container">
                <div class="feature-detail-label-sub">
                  <div>- Control :</div>
                </div>
                <transition name="el-zoom-in-bottom">

                  <div class="feature-detail-value" v-show="!tcShow">
                    {{ control }}%
                  </div>
                </transition>
                <transition name="el-zoom-in-bottom">
                  <!--<el-input-number class="feature-detail-edit" v-show="fm1Show" v-model="value" :step="5"></el-input-number>-->
                  <el-input-number class="feature-detail-edit" v-show="tcShow" v-model="control" :step="1" :min="0"
                                   :max="50"></el-input-number>
                </transition>
              </div>

            </li>
          </ul>
        </div>
      </div>
    </div>
    <div id="bar" @click="barClick">
      <i class="icon-animation" v-bind:class="[!toLeft ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left']"></i>
    </div>
  </div>
  </transition>
</template>

<script>
  //  import CanvasService from '../js/3D';
  //  import Highcharts from '../js/HighChart-Theme';
  //  import JsonData from '../assets/data.json';
  import router from '../router'
  import moment from 'moment';
  //  import $ from 'jquery';
  export default {
    name: 'index',
    mounted(){
    },
    watch: {
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

      }
    },
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
      barClick: function () {
        localStorage.setItem('cpName', this.cpName);
        localStorage.setItem('startTime', this.startTime);
        localStorage.setItem('type', this.type);
        localStorage.setItem('value', this.value);
        localStorage.setItem('vertical', this.vertical);
        localStorage.setItem('test', this.control);
        localStorage.setItem('FM_new', this.FM_new);
        localStorage.setItem('FM_retained', this.FM_retained);
        localStorage.setItem('FM_reactivated', this.FM_reactivated);

        console.log(this.$router.push({path: '/chart'}))

      }
    }
  }
</script>


<style scoped>

</style>

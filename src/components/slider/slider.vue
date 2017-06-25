<template>
    <div class="slider" style="margin-left: 30px">


        <!--<div class="el-slider__runway"-->
        <!--:class="{ 'show-input': showInput, 'disabled': disabled }"-->
        <!--ref="slider">-->
        <div class="alert-line " v-bind:style="line1Width"></div>
        <div class="alert-line alert-line-g" v-bind:style="line2Width"></div>
        <div class="alert-line alert-line-r" v-bind:style="line3Width"></div>
        <div class="icon-ball"
             :vertical="vertical"
             v-bind:style="ball1Left"
             v-model="firstValue"
             ref="button1">
        </div>
        <div class="icon-ball icon-ball-g"
             v-model="secondValue"
             v-bind:style="ball2Left"
             ref="button2">
        </div>
        <div class="icon-ball icon-ball-r"
             v-model="thirdValue"
             ref="button2">
        </div>
        <div style="position: fixed;left: 20px;top:60px;">111cmd:{{firstValue}}</div>
    </div>
    <!--</div>-->
</template>

<script type="text/babel">
    //  import ElInputNumber from 'element-ui/packages/input-number';
    //  import SliderButton from './button.vue';
    //  import { getStyle } from 'element-ui/src/utils/dom';
    //  import Emitter from 'element-ui/src/mixins/emitter';
    import $ from 'jquery';
    export default {
        name: 'Slider',


        props: {
            min: {
                type: Number,
                default: 0
            },
            max: {
                type: Number,
                default: 100
            },
            step: {
                type: Number,
                default: 1
            },
            value: {
                type: [Number, Array],
                default: 0
            },
            showInput: {
                type: Boolean,
                default: false
            },
            showInputControls: {
                type: Boolean,
                default: true
            },
            showStops: {
                type: Boolean,
                default: false
            },
            showTooltip: {
                type: Boolean,
                default: true
            },
            formatTooltip: Function,
            disabled: {
                type: Boolean,
                default: false
            },
            range: {
                type: Boolean,
                default: false
            },
            vertical: {
                type: Boolean,
                default: false
            },
            height: {
                type: String
            }
        },


        data() {
            return {
                firstValue: 30,
                secondValue: 30,
                thirdValue: 40,
                oldValue: null,
                dragging: false,
                tempTouchValue: 30,
                tempTouchValue1: 30,
                line1Width: {},
                line2Width: {},
                line3Width: {},
                ball1Left: {left: '30%'},
                ball2Left: {left: '70%'}
            };
        },

        watch: {},

        methods: {
            valueChanged() {
                if (this.range) {
                    return ![this.minValue, this.maxValue]
                        .every((item, index) => item === this.oldValue[index]);
                } else {
                    return this.value !== this.oldValue;
                }
            },
            setValues() {
                const val = this.value;
                if (this.range && Array.isArray(val)) {
                    if (val[1] < this.min) {
                        this.$emit('input', [this.min, this.min]);
                    } else if (val[0] > this.max) {
                        this.$emit('input', [this.max, this.max]);
                    } else if (val[0] < this.min) {
                        this.$emit('input', [this.min, val[1]]);
                    } else if (val[1] > this.max) {
                        this.$emit('input', [val[0], this.max]);
                    } else {
                        this.firstValue = val[0];
                        this.secondValue = val[1];
                        if (this.valueChanged()) {
                            this.$emit('change', [this.minValue, this.maxValue]);
                            this.dispatch('ElFormItem', 'el.form.change', [this.minValue, this.maxValue]);
                            this.oldValue = val.slice();
                        }
                    }
                } else if (!this.range && typeof val === 'number' && !isNaN(val)) {
                    if (val < this.min) {
                        this.$emit('input', this.min);
                    } else if (val > this.max) {
                        this.$emit('input', this.max);
                    } else {
                        this.firstValue = val;
                        if (this.valueChanged()) {
                            this.$emit('change', val);
                            this.dispatch('ElFormItem', 'el.form.change', val);
                            this.oldValue = val;
                        }
                    }
                }
            },

            setPosition(percent) {
                const targetValue = this.min + percent * (this.max - this.min) / 100;
                if (!this.range) {
                    this.$refs.button1.setPosition(percent);
                    return;
                }
                let button;
                if (Math.abs(this.minValue - targetValue) < Math.abs(this.maxValue - targetValue)) {
                    button = this.firstValue < this.secondValue ? 'button1' : 'button2';
                } else {
                    button = this.firstValue > this.secondValue ? 'button1' : 'button2';
                }
                this.$refs[button].setPosition(percent);
            },

            onSliderClick(event) {
                if (this.disabled || this.dragging) return;
                if (this.vertical) {
                    const sliderOffsetBottom = this.$refs.slider.getBoundingClientRect().bottom;
                    this.setPosition((sliderOffsetBottom - event.clientY) / this.$sliderSize * 100);
                } else {
                    const sliderOffsetLeft = this.$refs.slider.getBoundingClientRect().left;
                    this.setPosition((event.clientX - sliderOffsetLeft) / this.$sliderSize * 100);
                }
            },
            bindTouchEvent(index){
                let width = $(this.$el).width();
                let startX = null;
                let $el = $(this.$el).find('.icon-ball')[0];
                let _this = this;
                $el.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    console.log('firstValue', _this.firstValue);
                    startX = e.touches[0].clientX;
                    this.tempTouchValue = _this.firstValue;
                });
                $el.addEventListener('touchmove', (e) => {

                    e.preventDefault();
//          e.stopPropagation();

                    _this.last_cmd = 'touching';
                    let length = e.touches[0].clientX - startX;
                    startX = e.touches[0].clientX;
                    let left = this.tempTouchValue;
                    left += length * 1.000 / width * 100;

                    console.log('touch  left 1:  ' + _this.tempTouchValue);

                    this.tempTouchValue1 = _this.tempTouchValue1 - (left - _this.tempTouchValue);
                    console.log('touch  left 2:  ' + this.tempTouchValue1);
                    this.tempTouchValue = (left > 0) ? left : 0;
                    this.ball1Left = {left: (this.tempTouchValue || 0) + '%'}
                    //ball 2 to left
                    this.ball1Left = {left: (this.tempTouchValue || 0) + '%'}
                    this.line1Width = {width: (this.tempTouchValue || 0) + '%'}
                    this.line2Width = {width: (this.tempTouchValue1) + '%', left: this.tempTouchValue + '%'}
                    this.line3Width = {
                        width: (100 - this.tempTouchValue1 - this.tempTouchValue) + '%',
                        left: (this.tempTouchValue1 + this.tempTouchValue) + '%'
                    }
                });
                $el.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    console.log('touch  end');
                    this.last_cmd = 'touch  end';
                    this.secondValue -= (this.tempTouchValue - this.firstValue);
                    this.tempTouchValue1 = this.secondValue;
                    this.firstValue = this.tempTouchValue;
                });

                $el.onmousedown= (e) => {
//                    e.preventDefault();
                    console.log('firstValue', _this.firstValue);
                    startX = e.clientX;
                    this.tempTouchValue = _this.firstValue;

                    document.onmousemove=(e) => {

//                        e.preventDefault();
//          e.stopPropagation();

                        _this.last_cmd = 'touching';
                        let length = e.clientX - startX;
                        startX = e.clientX;
                        let left = this.tempTouchValue;
                        left += length * 1.000 / width * 100;

                        console.log('mouse  left 1:  ' + _this.tempTouchValue);

                        this.tempTouchValue1 = _this.tempTouchValue1 - (left - _this.tempTouchValue);
                        console.log('mouse  left 2:  ' + this.tempTouchValue1);
                        this.tempTouchValue = (left > 0) ? left : 0;
                        this.ball1Left = {left: (this.tempTouchValue || 0) + '%'}
                        //ball 2 to left
                        this.ball1Left = {left: (this.tempTouchValue || 0) + '%'}
                        this.line1Width = {width: (this.tempTouchValue || 0) + '%'}
                        this.line2Width = {width: (this.tempTouchValue1) + '%', left: this.tempTouchValue + '%'}
                        this.line3Width = {
                            width: (100 - this.tempTouchValue1 - this.tempTouchValue) + '%',
                            left: (this.tempTouchValue1 + this.tempTouchValue) + '%'
                        }
                    };


                    document.onmouseup =  (e) => {
//                        e.preventDefault();
                        console.log('mouse  end');
                        this.last_cmd = 'touch  end';
                        this.secondValue -= (this.tempTouchValue - this.firstValue);
                        this.tempTouchValue1 = this.secondValue;
                        this.firstValue = this.tempTouchValue;
                        document.onmousemove = null;//('mousedown')
                        document.onmouseup = null;
//                    $el.removeEventListener('mousedownousemove')
                    };

                }

            },
            bindTouch2Event(index){
                let width = $(this.$el).width();
                let startX = null;
                let $el = $(this.$el).find('.icon-ball')[1]
                $el.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.tempTouchValue1 = this.secondValue;
                    startX = e.touches[0].clientX;
                })
                $el.addEventListener('touchmove', (e) => {
                    e.preventDefault();
                    let length = e.touches[0].clientX - startX;
                    startX = e.touches[0].clientX;
                    let left = this.tempTouchValue1;
                    left += length * 1.000 / width * 100;
                    this.tempTouchValue1 = (left > 0) ? left : 0;

                    this.ball2Left = {left: (this.tempTouchValue1 + this.tempTouchValue) + '%'}
                    this.line2Width.width = this.tempTouchValue1 + '%';
                    this.line3Width = {
                        width: (100 - this.tempTouchValue - this.tempTouchValue1) + '%',
                        left: (this.tempTouchValue + this.tempTouchValue1) + '%'
                    }
                })
                $el.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.secondValue = this.tempTouchValue1;
                })

                $el.onmousedown = (e) => {
                    console.log('el2 mouse down');
                    this.tempTouchValue1 = this.secondValue;
                    startX = e.clientX;
                    document.onmousemove = (e) => {
                        console.log('el2 mouse move');
                        let length = e.clientX - startX;
                        startX = e.clientX;
                        let left = this.tempTouchValue1;
                        left += length * 1.000 / width * 100;
                        this.tempTouchValue1 = (left > 0) ? left : 0;

                        this.ball2Left = {left: (this.tempTouchValue1 + this.tempTouchValue) + '%'}
                        this.line2Width.width = this.tempTouchValue1 + '%';
                        this.line3Width = {
                            width: (100 - this.tempTouchValue - this.tempTouchValue1) + '%',
                            left: (this.tempTouchValue + this.tempTouchValue1) + '%'
                        }
                    }

                    document.onmouseup = (e) => {
//                        e.preventDefault();
                        this.secondValue = this.tempTouchValue1;

                        document.onmousemove = null;
                        document.onmouseup = null;
                        console.log('el2 mouse up');
                    }


                }


            }
        },

        computed: {},

        mounted() {
            this.ball1Left = {left: (this.firstValue || 0) + '%'}
            //ball 2 to left
            this.ball2Left = {left: (this.firstValue + this.secondValue) + '%'}
            this.line1Width = {width: (this.firstValue || 0) + '%'}
            this.line2Width = {width: (this.secondValue) + '%', left: this.firstValue + '%'}
            this.line3Width = {
                width: (100 - this.secondValue - this.firstValue) + '%',
                left: (this.secondValue + this.firstValue) + '%'
            }
            this.bindTouchEvent();
            this.bindTouch2Event();
        }
    };
</script>
<style scoped lang="scss">
    @import "slider.scss";
</style>

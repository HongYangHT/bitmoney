<!--
 * @Author: sam.hongyang
 * @LastEditors: sam.hongyang
 * @Description: function description
 * @Date: 2020-06-03 09:49:18
 * @LastEditTime: 2020-07-18 14:14:43
-->
<template>
<div :class="prefix">
  <!-- <inner-header></inner-header> -->
  <div :class="prefix + '__content'">
    <el-tabs v-model="tabName">
      <el-tab-pane label="比特币" name="BTC">
        <el-form ref="btc" :model="btc" :rules="btcRules" lebal-positions="left" label-width="160px">
          <el-form-item label="交易类型">
            <el-radio-group v-model="btc.type">
              <el-radio :label="1">买入开多(看涨)</el-radio>
              <el-radio :label="2">卖出开空(看跌)</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="价格类型">
            <el-radio-group v-model="btc.is_market">
              <el-radio :label="1">市价</el-radio>
              <el-radio :label="0">限价</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="限价价格" v-if="btc.is_market === 0">
            <el-input-number v-model="btc.price" :min="0" label="限价价格"></el-input-number>
          </el-form-item>
          <el-form-item label="止盈">
            <el-input-number v-model="btc.zy_price" :min="0" label="止盈"></el-input-number>
          </el-form-item>
          <el-form-item label="止损">
            <el-input-number v-model="btc.zs_price" :min="0" label="止损"></el-input-number>
          </el-form-item>
          <el-form-item label="差价设置" prop="diff">
            <el-input-number v-model="btc.diff" :min="0.01" label="差价设置"></el-input-number>
          </el-form-item>
          <el-form-item label="盈利亏损" prop="diffOrder">
            <el-input-number v-model="btc.diffOrder" :min="0.01" label="盈利亏损差价设置"></el-input-number>
          </el-form-item>
          <el-form-item label="下手手数">
            <el-input-number v-model="btc.num" :min="1" label="下手手数"></el-input-number>
          </el-form-item>
          <el-form-item label="采集数据间隔">
            <el-input-number v-model="btc.time" :min="1" label="采集数据间隔"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="startLoading" @click="$_onStart">开始执行</el-button>
            <el-button type="primary" ghost @click="$_onStop">停止执行</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="比特币现金" name="BCH">比特币现金</el-tab-pane>
      <el-tab-pane label="以太坊" name="ETH">以太坊</el-tab-pane>
      <el-tab-pane label="来特币" name="LTC">来特币</el-tab-pane>
    </el-tabs>
  </div>
</div>
</template>
<script>
import { Tabs, TabPane, Form, FormItem, Input, InputNumber, Button, Radio, RadioGroup } from 'element-ui';
import InnerHeader from '@/modules/components/header.vue';
import Divider from '@/modules/components/divider.vue'
import { localStore } from '@/common/utils/storage'
import pako from 'pako';
import { mapActions } from 'vuex';
const PREFIX = 'article'
export default {
  components: {
    Divider,
    InnerHeader,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Input.name]: Input,
    [InputNumber.name]: InputNumber,
    [Button.name]: Button,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup
  },
  data() {
    return {
      prefix: PREFIX,
      tabName: 'BTC',
      btc: {
        product_id: 2,
        type: 1,
        zy_price: 0,
        zs_price: 0,
        diff: 0.01,
        diffOrder: 0.01,
        num: '',
        time: 1000,
        lever: 100,
        price: 0,
        is_market: 1
      },
      btcRules: {},
      BMap: [],
      AMap: [],
      symbolObject: {
          // eosusdt: 'EOS/USDT',
          ethusdt: 'ETH',
          ltcusdt: 'LTC',
          bchusdt: 'BCH',
          // etcusdt: 'ETC/USDT',
          // xrpusdt: 'XRP/USDT',
          btcusdt: 'BTC'
      },
      timer: null,
      order: {},
      startLoading: false
    }
  },
  mounted() {
    this.initWebSocket()
    this.initWebSocket2()
    this.pingsocket()
    this.pingsocket2()
    this.init()
  },
  methods: {
    ...mapActions('auth', ['createOrder', 'closeOrder']),
    initWebSocket: function() {
        var t = ("https:" == location.protocol ? "wss://" : "ws://") + "mnacx.io.babll.com/websocket";
        this.websock = new WebSocket(t),
        this.websock.onopen = this.websocketonopen,
        this.websock.onerror = this.websocketonerror,
        this.websock.onmessage = this.websocketonmessage,
        this.websock.onclose = this.websocketclose
    },
    initWebSocket2: function () {
      var t = ("https:" == location.protocol ? "wss://" : "ws://") + "mnacx.io.babll.com/websocket";
        this.websock2 = new WebSocket(t),
        this.websock2.onopen = this.websocketonopen2,
        this.websock2.onerror = this.websocketonerror,
        this.websock2.onmessage = this.websocketonmessage2,
        this.websock2.onclose = this.websocketclose
    },
    websocketonopen: function() {
        this.websocketsend({
          type: "quote"
        })
    },
    websocketonopen2: function() {
        this.websocketsend2({
          type: "chicang",
          token: localStore.get('access_token') || '',
        })
    },
    websocketonerror: function(t) {
        console.log("WebSocket连接发生错误")
    },
    websocketonmessage: function(t) {
        var e = JSON.parse(t.data).data;
        if (this.marketlist = e,
        void 0 !== this.marketlist.length && this.marketlist.length >= 0) {
            for (var s = 0; s < this.marketlist.length; s++)
                this.marketlist[s].applies = "",
                this.marketlist[s].forehead = "",
                this.marketlist[s].applies = Number((this.marketlist[s].c - this.marketlist[s].o) / this.marketlist[s].o * 100).toFixed(2),
                this.marketlist[s].forehead = Number(this.marketlist[s].c - this.marketlist[s].o).toFixed(2);
            !0 === this.oneshow && (this.oneshow = !1,
            this.newid = this.marketlist[0].id,
            this.newcoin = this.marketlist[0].symbol)
        }
        let map = ['BTC', 'ETH', 'BCH', 'LTC']
        if (Object.prototype.toString.call(this.marketlist) === '[object Array]') {
          this.BMap = this.marketlist.filter(m => {
            return map.includes(m.symbol)
          });
          localStore.set('BMap', this.BMap);
        }
        this.$forceUpdate()

    },
    websocketonmessage2(t) {
      var e = JSON.parse(t.data).data;
      this.order = e;
      localStore.set('order', this.order);
    },
    websocketsend: function(t) {
        this.websock.send(JSON.stringify(t))
    },
    websocketsend2: function(t) {
        this.websock2.send(JSON.stringify(t))
    },
    websocketclose: function(t) {
        console.log("关闭")
    },
    pingsocket: function() {
        var t = this;
        t.pingtimer = setInterval(function() {
            t.websocketsend({
                type: "ping",
                token: localStore.get('access_token') || ''
            })
        }, 5e3)
    },
    pingsocket2: function() {
        var t = this;
        t.pingtimer = setInterval(function() {
            t.websocketsend2({
                type: "ping",
                token: localStore.get('access_token') || ''
            })
        }, 5e3)
    },
    subscribe: function(ws) {
        var symbols = Object.keys(this.symbolObject);
        // 订阅深度
        // // 谨慎选择合并的深度，ws每次推送全量的深度数据，若未能及时处理容易引起消息堆积并且引发行情延时
        // for (let symbol of symbols) {
        //     ws.send(JSON.stringify({
        //         "sub": `market.${symbol}.depth.step1 to unsub`,
        //         "id": `${symbol}`
        //     }));
        // }
        // 最新价格
        for (let symbol of symbols) {
            ws.send(JSON.stringify({
                "sub": `market.${symbol}.detail`,
                "id": `${symbol}`
            }));
            ws.send(JSON.stringify({
                "req": `market.${symbol}.detail`,
                "id": `${symbol}`
            }));
        }
    },

    handle: function (msg) {
      let symbol = msg.ch.split('.')[1];
      let channel = msg.ch.split('.')[2];
      switch (channel) {
          // case 'depth':
          //     msg.tick.symbol = symbolObject[symbol]
          //     msg.tick.asks.length = 10
          //     msg.tick.bids.length = 10
          //     msg.tick.asks.reverse()
          //     break;
          case 'detail':
              msg.tick.symbol = this.symbolObject[symbol]
              msg.tick.currency_name = this.symbolObject[symbol].split('/')[0]
              msg.tick.now_price = msg.tick.close

              msg.tick.volume = msg.tick.vol
              msg.tick.change = parseFloat((msg.tick.close - msg.tick.open) / msg.tick.open * 100).toFixed(2)
              let index = this.AMap.findIndex(item => item.symbol === msg.tick.symbol)
              if (index !== -1) {
                this.AMap[index] = msg.tick;
              } else {
                this.AMap.push(msg.tick)
              }
              localStore.set('AMap', this.AMap);
              break;
          default:
              break;
      }
    },

    init: function () {
      let WS_URL = ("https:" == location.protocol ? "wss://" : "wss://") + "api.huobi.pro/ws";
      var ws = new WebSocket(WS_URL);
      ws.onopen = () => {
          console.log('open');
          this.subscribe(ws);
      }
      ws.onmessage = (event) => {
          let blob = event.data;
          let reader = new FileReader();
          let that = this;
          reader.onload = function (e) {
              let ploydata = new Uint8Array(e.target.result);
              let text = pako.inflate(ploydata, {to: 'string'});
              let msg = JSON.parse(text);
              if (msg.ping) {
                  ws.send(JSON.stringify({
                      pong: msg.ping
                  }));
              } else if (msg.tick) {
                  that.handle(msg);
              } else {
                  // console.log(text);
              }
          };
          reader.readAsArrayBuffer(blob, "utf-8");
      }
    },
    $_createOrder(params) {
      return new Promise((resolve, reject) => {
        this.createOrder({
          data: {
            send: CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(JSON.stringify(params)), CryptoJS.enc.Utf8.parse("1234123412ABCDEF"), {
                iv: CryptoJS.enc.Utf8.parse("ABCDEF1234123412"),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }).toString()
          }
        }).then(() => {
          resolve()
        })
      })
    },
    $_closeOrder(params) {
      return new Promise((resolve, reject) => {
        this.closeOrder({
          data: {
            send: CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(JSON.stringify(params)), CryptoJS.enc.Utf8.parse("1234123412ABCDEF"), {
                iv: CryptoJS.enc.Utf8.parse("ABCDEF1234123412"),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }).toString()
          }
        }).then(() => {
          resolve()
        })
      })
    },
    $_onStart() {
      switch (this.tabName) {
        case 'BTC':
          this.timer = setInterval(() => {
            this.startLoading = true;
            console.log('11111');
            let orders = localStore.get('order');
            if (orders.order && orders.order.length) {
              console.log('22222');
              orders.order.forEach(async o => {
                if (Math.abs(o.last_price - o.price) >= this.btc.diffOrder) {
                  await this.$_closeOrder({
                    id: o.id,
                    num: o.total,
                    timestamp: Date.parse(new Date)/1e3
                  })
                }
              })
            } else {
              console.log('33333');
              let BMap = localStore.get('BMap');
              let AMap = localStore.get('AMap');
              BMap.forEach(async item => {
                switch (item.symbol) {
                  case 'BTC':
                    let b_price_now = item.c;
                    let a_price_now = AMap.find(a => a.symbol === item.symbol).now_price
                    if (Math.abs(b_price_now - a_price_now) >= this.btc.diff) {
                        await this.$_createOrder({
                          product_id: this.btc.product_id,
                          type: this.btc.type,
                          num: this.btc.num,
                          is_market: this.btc.is_market,
                          price: this.btc.price,
                          zy_price: this.btc.zy_price,
                          zs_price: this.btc.zs_price,
                          timestamp: Date.parse(new Date)/1e3,
                          lever: this.btc.lever
                        })
                    }
                    break;

                  default:
                    break;
                }
              });
            }
          }, this.btc.time);
          break;

        default:
          break;
      }
    },
    $_onStop() {
      clearInterval(this.timer);
      this.startLoading = false;
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.startLoading = false;
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/modules/article/_index.scss';
</style>

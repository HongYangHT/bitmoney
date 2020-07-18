<!--
 * @Author: sam.hongyang
 * @LastEditors: sam.hongyang
 * @Description: function description
 * @Date: 2020-07-03 09:30:53
 * @LastEditTime: 2020-07-16 17:25:09
-->
<template>
  <!-- 制作个人简历 -->
  <div :class="prefix"></div>
</template>
<script>
// import io from 'socket.io-client';
const PREFIX = 'about-me'
export default {
  components: {},
  data: () => ({
    prefix: PREFIX
  }),
  mounted() {
    // this.getSocket();
    this.initWebSocket()
    this.pingsocket()
    this.otherinitWebSocket()
    this.otherpingsocket()
  },
  methods: {
    // getSocket() {
    //   const socket = io('http://mnacx.io.babll.com/websocket')
    //   socket.on('connection', socket => {
    //     socket.emit('ping', {
    //       token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIiLCJhdWQiOiIiLCJpYXQiOjE1OTQ4NzE5NjksIm5iZiI6MTU5NDg3MTk2OSwiZXhwIjoxNTk2MTY3OTY5LCJ1aWQiOjYwfQ.uiJHPSI_kiJRoYXvbsfYZcq9IuALa3bojYmKWF3Wv9Q",
    //       type: "ping"
    //     });
    //     socket.on('quote_data', (data) => {
    //       console.log(data);
    //     })
    //   })
    // },
    otherinitWebSocket() {
      var t = ("https:" == location.protocol ? "wss://" : "wss://") + "api.huobi.pro/ws";
      this.otherwebsock = new WebSocket(t),
      this.otherwebsock.onopen = this.otherwebsocketonopen,
      this.otherwebsock.onerror = this.otherwebsocketonerror,
      this.otherwebsock.onmessage = this.otherwebsocketonmessage,
      this.otherwebsock.onclose = this.otherwebsocketclose
    },
    otherwebsocketonopen: function() {
        console.log("WebSocket连接成功"),
        this.otherwebsocketsend({
            type: "quote"
        })
    },
    otherwebsocketonerror: function(t) {
        console.log("WebSocket连接发生错误")
    },
    otherwebsocketonmessage: function(t) {
        var e = t.data.data;
        var blob = new Blob([e]);
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, 'text');
          return;
        }
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.setAttribute('download', 'text');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.$forceUpdate()
    },
    otherwebsocketsend: function(t) {
        this.otherwebsock.send(JSON.stringify(t))
    },
    otherwebsocketclose: function(t) {
        console.log("关闭")
    },
    otherpingsocket: function() {
        var t = this;
        t.otherpingtimer = setInterval(function() {
            t.otherwebsocketsend({
                type: "ping",
                token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIiLCJhdWQiOiIiLCJpYXQiOjE1OTQ4NzE5NjksIm5iZiI6MTU5NDg3MTk2OSwiZXhwIjoxNTk2MTY3OTY5LCJ1aWQiOjYwfQ.uiJHPSI_kiJRoYXvbsfYZcq9IuALa3bojYmKWF3Wv9Q'
            })
        }, 5e3)
    },
    initWebSocket: function() {
        var t = ("https:" == location.protocol ? "wss://" : "ws://") + "mnacx.io.babll.com/websocket";
        this.websock = new WebSocket(t),
        this.websock.onopen = this.websocketonopen,
        this.websock.onerror = this.websocketonerror,
        this.websock.onmessage = this.websocketonmessage,
        this.websock.onclose = this.websocketclose
    },
    websocketonopen: function() {
        console.log("WebSocket连接成功"),
        this.websocketsend({
            type: "quote"
        })
    },
    websocketonerror: function(t) {
        console.log("WebSocket连接发生错误")
    },
    websocketonmessage: function(t) {
        var e = JSON.parse(t.data).data;
        if (this.marketlist = e,
        console.log(this.marketlist),
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
        this.$forceUpdate()
    },
    websocketsend: function(t) {
        this.websock.send(JSON.stringify(t))
    },
    websocketclose: function(t) {
        console.log("关闭")
    },
    pingsocket: function() {
        var t = this;
        t.pingtimer = setInterval(function() {
            t.websocketsend({
                type: "ping",
                token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIiLCJhdWQiOiIiLCJpYXQiOjE1OTQ4NzE5NjksIm5iZiI6MTU5NDg3MTk2OSwiZXhwIjoxNTk2MTY3OTY5LCJ1aWQiOjYwfQ.uiJHPSI_kiJRoYXvbsfYZcq9IuALa3bojYmKWF3Wv9Q'
            })
        }, 5e3)
    },
  }
}
</script>
<style lang="scss">
@import "@/assets/scss/modules/about-me/_index.scss";
</style>

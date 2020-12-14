<template>
  <v-app>
    <v-navigation-drawer dark v-model="drawer" fixed temporary>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            MQTT Log Viewer
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item-group>
          <v-list-item link @click="goPage('Home')">
            <v-list-item-icon>
              <v-icon>mdi-washing-machine</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>장비별 검색</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link @click="goPage('List')">
            <v-list-item-icon>
              <v-icon>mdi-clipboard-list</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>최근 에러 리스트</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dark>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>MQTT Log Viewer</v-toolbar-title>
      <v-spacer></v-spacer>
      {{ now | moment("YYYY년 MM월 DD일 HH:mm") }}
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-footer app> </v-footer>
  </v-app>
</template>

<script>
import mqtt from 'mqtt';
import { API } from './plugins/axios';
export default {
  data() {
    return {
      drawer: false,
      now: Date.now(),
      nowListener: null,
      client: null,
    };
  },
  mounted() {
    this.nowListener = setInterval(() => {
      this.now = Date.now();
    }, 1000);

    const URL = 'ws://dailywash.co.kr:9001';
    this.client = mqtt.connect(URL);
    this.client.on('connect', () => {
      // console.log('connected!');
      this.client.subscribe('#');
    });
    this.client.on('message', (topic, message) => {
      const mac = topic.split('/')[1];
      const status = topic.split('/')[3];
      if(status === 'wifi' || status === 'power') {
        this.notifyError(mac, status, message.toString());
      }
    });
  },
  beforeDestory() {
    clearInterval(this.nowListener);
    this.client = null;
  },
  methods: {
    async notifyError(mac, status, message) {
      const res = await API({
        method: 'get',
        url: '/getMachine',
        params: { mac },
      });
      const machineInfo = res.data[0];
      // console.log(machineInfo);
      const { companyName, name } = machineInfo;
      // console.log(companyName, name);
      this.$dialog.notify.error(`지점: ${companyName}, 장비명: ${name}, mac: ${mac}, status: ${status}, message: ${message}`, {
        position: 'top-right',
        timeout: 20000
      });
    },
    goPage(name) {
      if(this.$route.name !== name) {
        this.$router.push({ name });
      }
    }
  },
};
</script>

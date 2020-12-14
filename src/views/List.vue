<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col cols="6">
          <v-btn dark color="grey darken-3" block @click="getList"> 100개 씩 불러오기 </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn dark color="grey darken-1" block @click="resetList"> 초기화 </v-btn>
        </v-col>
      </v-row>
      <v-col cols="12">
        <v-data-table
          :headers="tableHeaders"
          :items="tableDatas"
          :items-per-page="15"
          item-key="mac.id"
          class="elevation-1"
        >
        </v-data-table>
      </v-col>
    </v-container>
  </v-app>
</template>

<script>
import { API } from "../plugins/axios";
export default {
  name: "List",
  data() {
    return {
      offset: 0,
      limit: 100,
      tableHeaders: [
        {
          text: "발생시각",
          align: "start",
          sortable: true,
          value: "created_at",
        },
        { text: "지점", align: "start", sortable: false, value: "name" },
        {
          text: "장비명",
          align: "start",
          sortable: false,
          value: "machineName",
        },
        { text: "MAC주소", align: "start", sortable: false, value: "mac" },
        { text: "TOPIC", align: "start", sortable: false, value: "topic" },
        { text: "Message", align: "start", sortable: false, value: "message" },
      ],
      tableDatas: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        const { data } = await API({
          method: "get",
          url: "/all/error",
          params: { offset: this.offset, limit: this.limit },
        });
        this.tableDatas = this.tableDatas.concat(
          data.map((d) =>
            Object.assign({}, { ...d, topic: d.topic.split("/")[3] })
          )
        );
        this.offset += 100;
      } catch (error) {
        console.log("getList error: ", error);
      }
    },
    resetList() {
      this.tableDatas = [];
      this.offset = 0;
    },
  },
};
</script>
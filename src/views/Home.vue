<template>
  <v-app>
    <Searcher
      @selectedCompany="selectedCompany = $event"
      @selectedMachine="selectedMachine = $event"
    />
    <SelectDate @startDate="startDate = $event" @endDate="endDate = $event" />
    <v-container>
      <v-col cols="12">
        <v-btn dark block @click="searchDB">
          {{ buttonText }}
        </v-btn>
      </v-col>
      <v-divider />
      <v-col cols="12">
        <v-data-table
          :headers="tableHeaders"
          :items="tableDatas"
          :items-per-page="5"
          item-key="mac.id"
          class="elevation-1"
        ></v-data-table>
      </v-col>
    </v-container>
  </v-app>
</template>

<script>
import Searcher from '../components/Searcher';
import SelectDate from '../components/SelectDate';
import { API } from '../plugins/axios';
import moment from 'moment';
export default {
  name: "Home",
  components: {
    Searcher,
    SelectDate,
  },
  data() {
    return {
      selectedCompany: null,
      selectedMachine: null,
      startDate: moment().format("YYYY-MM-DD 00:00:00"),
      endDate: moment().format("YYYY-MM-DD 23:59:59"),
      tableHeaders: [
        {
          text: "발생시각",
          align: "start",
          sortable: true,
          value: "created_at",
        },
        { text: '장비명', align: 'start', sortable: true, value: 'name' },
        { text: "MAC주소", align: "start", sortable: false, value: "mac" },
        { text: "TOPIC", align: "start", sortable: false, value: "topic" },
        { text: "Message", align: "start", sortable: false, value: "message" },
      ],
      tableDatas: [],
    };
  },
  computed: {
    buttonText() {
      if (!this.selectedCompany) return "지점을 선택해주세요";
      else if (!this.selectedMachine || this.selectedMachine.length === 0) return "장비를 선택해주세요";
      else return "검색하기";
    },
  },
  methods: {
    async searchDB() {
      if (this.buttonText !== "검색하기") {
        console.log("검색못함");
      } else {
        const mac = this.selectedMachine.map(machine => machine.mac);
        const startDate = this.startDate;
        const endDate = this.endDate;
        try {
          const { data } = await API({
            method: "get",
            url: "/searchError",
            params: { mac, startDate, endDate },
          });
          this.tableDatas = data.map((d) =>
            Object.assign({}, { ...d, topic: d.topic.split("/")[3] })
          );
          if(data.length === 0) alert('검색 결과가 없습니다');
        } catch (error) {
          console.log("searchDB error: ", error);
        }
      }
    },
  },
};
</script>

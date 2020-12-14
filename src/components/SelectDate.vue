<template>
  <div>
    <v-container>
      <v-row align="center">
        <v-col cols="12">
          <h2>날짜 범위 선택</h2>
          <v-dialog ref="dialog" v-model="modal" width="290px" persistent>
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateRangeText"
                label="검색 범위 설정"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="dates" range scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="confirmDate"> OK </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
      </v-row>
      <v-divider />
      <v-row align="center">
        <v-col cols="12">
          <h2>
            <span>{{ dates[0] }}</span> 시작 시간
          </h2>
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="startHour"
            :items="hours"
            outlined
            label="시"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="startMinute"
            :items="minutes"
            outlined
            label="분"
          ></v-select>
        </v-col>
        <v-col cols="12">
          <h2>
            <span>{{ dates[1] }}</span> 종료 시간
          </h2>
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="endHour"
            :items="hours"
            outlined
            label="시"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="endMinute"
            :items="minutes"
            outlined
            label="분"
          ></v-select>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    dates: [
      new Date().toISOString().substr(0, 10),
      new Date().toISOString().substr(0, 10),
    ],
    modal: false,
    hours: new Array(24).fill(0).map((item, i) => {
      return item + i < 10 ? "0" + (item + i) : (item + i).toString();
    }),
    minutes: new Array(60).fill(0).map((item, i) => {
      return item + i < 10 ? "0" + (item + i) : (item + i).toString();
    }),
    startHour: "00",
    endHour: "23",
    startMinute: "00",
    endMinute: "59",
  }),
  computed: {
    dateRangeText() {
      return this.dates.join(" ~ ");
    },
    startDate() {
      return (
        this.dates[0] + " " + this.startHour + ":" + this.startMinute + ":00"
      );
    },
    endDate() {
      return (
        this.dates[1] + " " + this.endHour + ":" + this.endMinute + ":59"
      );
    },
  },
  watch: {
    startDate(newValue) {
      this.$emit('startDate', newValue);
    },
    endDate(newValue) {
      this.$emit('endDate', newValue);
    },
  },
  methods: {
    confirmDate() {
      this.modal = false;
      if (new Date(this.dates[0]) > new Date(this.dates[1])) {
        const [startDate, endDate] = this.dates;
        this.dates = [endDate, startDate];
      }
    },
  },
};
</script>
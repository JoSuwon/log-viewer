<template>
  <div>
    <v-container>
      <v-row align="center">
        <v-col cols="12">
          <h2>지점 명 검색</h2>
          <v-autocomplete
            v-model="companyValue"
            :items="companyNameList"
            outlined
            chips
            label="지점 키워드 검색"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-divider />
      <v-row align="center">
        <v-col cols="12">
          <h2>장비 선택</h2>
          <v-select
            v-model="machineValue"
            :items="machineNameList"
            label="장비 선택"
            multiple
            outlined
          ></v-select>
        </v-col>
      </v-row>
      <v-divider />
    </v-container>
  </div>
</template>

<script>
import { API } from "../plugins/axios";
export default {
  name: "Searcher",
  data() {
    return {
      companys: [],
      machines: [],
      companyValue: "",
      machineValue: [],
      selectedCompany: {},
      selectedMachines: [],
    };
  },
  computed: {
    companyNameList() {
      return this.companys.map((company) => company.name);
    },
    machineNameList() {
      return this.machines.map((machine) => machine.name);
    },
  },
  watch: {
    companyValue(newValue) {
      this.selectedCompany = this.companys.find(
        (company) => newValue === company.name
      );
      this.$emit('selectedCompany', this.selectedCompany);
      this.getMachines();
    },
    machineValue(newValue) {
      // console.log(Array.from(newValue));
      this.selectedMachine = [];
      this.machines.filter(
        (machine) => {
          Array.from(newValue).forEach(v => {
            if(v === machine.name) this.selectedMachine.push(machine);
          });
        }
      );
      this.$emit('selectedMachine', this.selectedMachine);
    },
  },
  mounted() {
    this.getCompanys();
  },
  methods: {
    async getCompanys() {
      try {
        const res = await API({
          method: "get",
          url: "/list/company",
        });
        this.companys = res.data;
      } catch (error) {
        console.log("getCompanys error: ", error.response);
      }
    },
    async getMachines() {
      this.machines = [];
      this.machineValue = "";
      this.selectedMachine = {};
      try {
        const res = await API({
          method: "get",
          url: `/list/machine/${this.selectedCompany.id}`,
        });
        this.machines = res.data;
      } catch (error) {
        console.log("getMachines error: ", error.response);
      }
    },
  },
};
</script>
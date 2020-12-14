import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import moment from 'moment';
import VueMoment from 'vue-moment';

moment.locale('ko');

Vue.use(Vuetify);
Vue.use(VueMoment, { moment });

export default new Vuetify({
});

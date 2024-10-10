// main.js
import { createApp } from 'vue';
import App from './App.vue';

// Importar Vuetify
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';

// Importar Vue Router
import router from './router';

// Configurar Vuetify
const vuetify = createVuetify({
  components,
  directives,
});

createApp(App)
  .use(router) // Usar el router
  .use(vuetify) // Usar Vuetify
  .mount('#app');

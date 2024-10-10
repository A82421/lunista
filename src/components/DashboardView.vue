<template>
  <div>
    <h2>Dashboard</h2>
    <canvas id="clientes-chart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'; // Importa y registra los módulos

// Registra los elementos de Chart.js que necesitas
Chart.register(...registerables);

export default {
  name: 'DashboardView',
  data() {
    return {
      chartInstance: null, // Para almacenar la instancia del gráfico
      dailyData: {}, // Para almacenar datos diarios
    };
  },
  mounted() {
    this.fetchClients(); // Llamada inicial para obtener los clientes
    setInterval(() => {
      this.fetchClients(); // Actualiza los clientes cada 5 minutos
    }, 300000); // 300000 milisegundos = 5 minutos
  },
  methods: {
    async fetchClients() {
      try {
        const response = await fetch('http://localhost:3000/clientes'); // Asegúrate de que la URL sea correcta
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const clients = await response.json();
        this.renderClientChart(clients); // Renderiza el gráfico con los datos
        console.log(clients);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    },

    renderClientChart(clients) {
      const today = new Date().toISOString().split('T')[0];

      // Filtra los clientes creados hoy
      const clientsToday = clients.filter(cliente => cliente.created_at.startsWith(today));
      
      // Organiza los datos por minuto
      this.dailyData = {};
      clientsToday.forEach(cliente => {
        const date = new Date(cliente.created_at);
        const minuto = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Acumula datos por minuto
        if (!this.dailyData[minuto]) {
          this.dailyData[minuto] = 0;
        }
        this.dailyData[minuto]++;
      });

      // Convierte los datos a un formato para Chart.js
      const labels = Object.keys(this.dailyData);
      const data = Object.values(this.dailyData);

      // Si ya existe un gráfico, destrúyelo antes de crear uno nuevo
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      // Crea el gráfico de tipo "line"
      const ctx = document.getElementById('clientes-chart').getContext('2d');
      this.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Nuevos Clientes por Minuto',
            data: data,
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(0,0,255,1.0)",
            borderColor: "rgba(0,0,255,0.1)",
            borderWidth: 2
          }]
        },
        options: {
          legend: { display: false },
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
              max: Math.max(...data) + 1, // Ajusta el máximo del eje Y
              ticks: {
                stepSize: 1,
                callback: function(value) {
                  if (Number.isInteger(value)) {
                    return value;
                  }
                  return null;
                }
              }
            },
            x: {
              type: 'category'
            }
          }
        }
      });
    },
  },
};
</script>

<style scoped>
/* Agrega cualquier estilo adicional aquí si es necesario */
</style>

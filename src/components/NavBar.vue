<template>
  <div>
    <v-app-bar>
      <v-toolbar-title>Gestión Hotelera</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="irGrafico">Clients Graphic</v-btn>
      <v-btn @click="toggleClientForm">Toggle Client Form</v-btn>
    </v-app-bar>

    <v-container>
      <v-container v-if="showClientForm">
        <v-form @submit.prevent="isEditing ? updateClient() : addClient()">
          <v-text-field
            v-model="client.nombre"
            label="Nombre"
            required
          ></v-text-field>
          <v-text-field
            v-model="client.email"
            label="Email"
            required
            type="email"
          ></v-text-field>
          <v-text-field
            v-model="client.telefono"
            label="Teléfono"
          ></v-text-field>
          <v-text-field
            v-model="client.direccion"
            label="Dirección"
          ></v-text-field>
          <v-text-field
            v-model="client.cliente_idcard"
            label="ID del Cliente"
          ></v-text-field>
          <v-btn type="submit">{{
            isEditing ? "Actualizar Cliente" : "Agregar Cliente"
          }}</v-btn>
        </v-form>
      </v-container>

      <v-container v-if="!showClientForm">
        <table class="client-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>ID del Cliente</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in clients" :key="client.id">
              <td>{{ client.id }}</td>
              <td>{{ client.nombre }}</td>
              <td>{{ client.email }}</td>
              <td>{{ client.telefono }}</td>
              <td>{{ client.direccion }}</td>
              <td>{{ client.cliente_idcard }}</td>
              <td class="btnstable">
                <v-btn class="btnedit" @click="editClient(client)">Editar</v-btn>
                <v-btn class="btndelete" @click="deleteClient(client.id)">Eliminar</v-btn>
              </td>
            </tr>
            <tr v-if="clients.length === 0">
              <td colspan="7">No hay clientes disponibles</td>
            </tr>
          </tbody>
        </table>
      </v-container>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      showClientForm: false,
      isEditing: false, // Nueva propiedad para indicar si estamos editando
      client: {
        id: null, // Añadir id para la edición
        nombre: "",
        email: "",
        telefono: "",
        direccion: "",
        cliente_idcard: "",
      },
      clients: [],
    };
  },
  methods: {
    irGrafico() {
      this.$router.push("/DashboardView");
    },
    toggleClientForm() {
      this.showClientForm = !this.showClientForm;
      if (!this.showClientForm) {
        this.fetchClients();
      }
    },
    async addClient() {
      try {
        const response = await fetch("http://localhost:3000/clientes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.client),
        });

        if (!response.ok) {
          throw new Error("Error al agregar cliente");
        }

        this.resetClientForm();
        this.fetchClients();
      } catch (error) {
        console.error("Error adding client:", error);
      }
    },
    resetClientForm() {
      this.client = {
        id: null,
        nombre: "",
        email: "",
        telefono: "",
        direccion: "",
        cliente_idcard: "",
      };
      this.isEditing = false; // Resetea el estado de edición
    },
    async fetchClients() {
      try {
        const response = await fetch("http://localhost:3000/clientes");
        if (!response.ok) {
          throw new Error("Error fetching clients");
        }
        const data = await response.json();
        this.clients = data;
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    },
    async deleteClient(id) {
      try {
        const response = await fetch(`http://localhost:3000/clientes/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Error al eliminar cliente");
        }

        this.fetchClients();
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    },
    editClient(client) {
      this.client = { ...client }; // Carga los datos del cliente en el formulario
      this.showClientForm = true; // Muestra el formulario al editar
      this.isEditing = true; // Cambia el estado a edición
    },
    reloadPage() {
      window.location.reload();
    },
    async updateClient() {
      try {
        const response = await fetch(
          `http://localhost:3000/clientes/${this.client.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.client),
          }
        );

        if (!response.ok) {
          throw new Error("Error al actualizar cliente");
        }
        if (response.ok) {
            this.reloadPage();
        }
        this.resetClientForm();
        this.fetchClients();
      } catch (error) {
        console.error("Error updating client:", error);
      }
    },
  },
  created() {
    this.fetchClients();
  },
};
</script>

<style scoped>
.client-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.client-table th,
.client-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

.btnedit{
    margin-right: 5px;
}
.client-table th {
  background-color: #f2f2f2;
}

.client-table tr:hover {
  background-color: #f9f9f9;
}

.client-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.client-table td {
  vertical-align: middle;
}
</style>

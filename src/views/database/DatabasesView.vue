<template>
  <link
      href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
      rel="stylesheet"
  />
  <div class="flex-container">
    <form v-on:submit="createDatabase">
      <div class="container-header">
        <input required v-model="db_name" placeholder="Enter database name" class="form-control col-2">
        <input type="submit" value="Создать бд" class="btn btn-primary col-1">
      </div>
    </form>
  </div>
  <br>
  <div v-if="databases" >
    <div class="form" v-if="!databases.length">
      У вас нет бд
    </div>
    <div v-else style="display: flex">
      <div class="card" v-for="database in databases" :key="database">
        <button @click="deleteDocument(database)" class="btn-delete">
          <span class="glyphicon glyphicon-floppy-remove" style="font-size: 18px"></span>
        </button>
        <RouterLink :to="{ name: 'database', params: { id: database } }">
          <div><img src="@/assets/docx.png" class="avatar" alt="#"/></div>
          <div class="test">
            <h4 class="card__name">{{ database }}</h4>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>

</template>

<script>
import { RouterLink } from "vue-router";
import { useToast } from "vue-toastification";
export default {
  name: "DatabasesView",
  components: {
    RouterLink,
  },
  setup() {
    const toast = useToast();
    return {
      toast,
    };
  },
  data() {
    return {
      databases: [],
      db_name: '',
    };
  },
  methods: {
    async createDatabase (event) {
      event.preventDefault();
      const request = await fetch(`http://eldorqazwe.online/create_database?name=${this.db_name}`);
      if (request.ok) {
        const response = await request.json();
        if (response.status) {
          this.databases.push(this.db_name)
          this.toast.info(`бд создана ${this.db_name}`);

          this.db_name = ""
        }
      }

    },
    async deleteDocument(id) {
      const request = await fetch(`http://eldorqazwe.online/delete_database?db_name=${id}`);
      if (request.ok) {
        const response = await request.json();
        if (response.status) {
          this.databases = this.databases.filter((file) => file != id);
          this.toast.info(`БД №${id} удалён`);
        }
      }
    },
  },
  async mounted() {
    const request = await fetch("http://eldorqazwe.online/get_databases");
    if (request.ok) {
      const response = await request.json();
      if (response.status) this.databases = response.data;
    }
  },
};
</script>

<style scoped>

.form {
  text-align: center;
}

.flex-container {
  display: flex;

  flex-direction: column;
  align-items: stretch;
}

.container-header {
  display: flex;
  flex-direction: row;
}
.container-header, div, input {
  margin-right: 10px;
}
.container-header, div :last-child {
  margin-right: 0;
}

.col-2 {
  flex: 2
}
.col-1 {
  flex: 1
}


</style>

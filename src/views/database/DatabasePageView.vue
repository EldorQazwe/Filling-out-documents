<template>
  <div class="form" v-if="error">{{ error }}</div>
  <div class="form" v-else-if="!tables">Загрузка</div>
  <div v-else>
    <div class="flex-container">
      <form v-on:submit="createTable">
        <div class="container-header">
          <input required :value="$route.params.id" disabled class="form-control col-1">
          <input required v-model="table_name" placeholder="Enter table name" class="form-control col-3">
          <input type="submit" value="Создать таблицу" class="btn btn-primary col-2">
          <input @click="addNewItem" value="Добавить поле" class="btn btn-success col-1">
        </div>

        <div class="container-body">
          <div class="col-3" v-for="(item, index) in items" :key="index">
            <div class="input-group">
              <input
                  required
                  ref="tables"
                  class="title form-control"
                  :placeholder="item.placeholder"
                  @keyup="updateItem(index)"
                  @blur="updateItem(index)"
                  @paste="updateItem(index)"
                  @delete="updateItem(index)"
              >
              <span class="input-group-addon" @click="deleteItem(item)"><i class="glyphicon glyphicon-remove"></i></span>
            </div>
          </div>
        </div>
      </form>
    </div>

    <div style="display: flex">
      <div class="card" v-for="table in tables" :key="table">
        <button @click="deleteDocument(table)" class="btn-delete">
          <span class="glyphicon glyphicon-floppy-remove" style="font-size: 18px"></span>
        </button>
        <RouterLink :to="{ name: 'table', params: { database: $route.params.id, table: table }}">
          <div><img src="@/assets/table.png" class="avatar" alt="#"/></div>
          <div class="test">
            <h4 class="card__name">{{ table }}</h4>
          </div>
        </RouterLink>
      </div>
    </div>

    <div class="form" v-if="error === false && tables.length === 0">В этой бд отсутствуют таблицы</div>
  </div>
</template>


<script>
import { useToast } from "vue-toastification";
export default {
  name: "DatabasePageView",
  data() {
    return {
      tables: [],
      items: [],
      table_name: '',
      error: false,
    };
  },
  setup() {
    const toast = useToast();
    return {
      toast,
    };
  },
  methods: {
    async deleteDocument (table) {
      const query = `db_name=${this.$route.params.id}&table_name=${table}`
      const request = await fetch(
          `/api/delete_table?${query}`
      );
      if (request.ok) {
        const response = await request.json();
        if (response.status) {
          this.tables = this.tables.filter((i) => {return i !== table})
          this.toast.success("Вы успешно удалили таблицу")
        }
      }
    },
    async createTable (event) {
      event.preventDefault();
      if (this.items.length === 0) {
        this.toast.error('В таблице должны быть колонки')
        return
      }
      const columns = this.items.map((item) => {return item.title})

      const query = `columns=${columns}&db_name=${this.$route.params.id}&table_name=${this.table_name}`
      const request = await fetch(
          `/api/create_table?${query}`
      );
      if (request.ok) {
        const response = await request.json();
        if (response.status) {
          this.tables.push(this.table_name) // TODO: EDIT
          this.toast.success("Вы успешно создали таблицу")

          this.items = []
          this.table_name = ""
        }
      }
    },
    addNewItem() {
      if (this.items.length < 5)
      this.items.push({
        placeholder: 'Enter table name',
      });
    },
    deleteItem(item) {
      let index = this.items.indexOf(item);
      this.items.splice(index, 1);
    },
    updateItem(index) {
      this.items[index].title = this.$refs.tables[index].value;
    },
    async getTablesByDatabases () {
      const request = await fetch(
          `/api/get_tables?db_name=${this.$route.params.id}`
      );
      if (request.ok) {
        const response = await request.json();
        if (response.status) {
          this.tables = response.data
        } else {
          this.error = response.status === false ? response.msg: false
        }
      }
    }
  },
  async mounted() {
    await this.getTablesByDatabases()
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
.container-header, .container-body, div, input {
  margin-right: 10px;
}
.container-header, .container-body, div :last-child {
  margin-right: 0;
}
.col-3 {
  flex: 3;
}
.col-2 {
  flex: 2
}
.col-1 {
  flex: 1
}

.container-body {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
}

</style>

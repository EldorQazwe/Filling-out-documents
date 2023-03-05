<template>
  <link
      href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
      rel="stylesheet"
  />

  <div v-if="!rows.length">Загрузка</div>

  <div v-else>

    <div class="flex-container container-header">
      <input
          v-for="row in rows"
          :key="row"
          class="col-2 form-control"
          :value="row[1]"
          disabled
      />
      <div class="row-1 col-1 container-header">
        <span class="input-group-addon col-1">
          <i class="glyphicon glyphicon-floppy-remove"></i>
        </span>
      </div>
    </div>
    <hr>
    <div class="flex-container container-header">

      <input
          disabled
          :value="getCount()"
          class="col-2 form-control"
      />

      <input
          v-for="(row, index) in rows.slice(1)"
          :key="row[1]"
          @input="updateData(index, row[1])"
          class="col-2 form-control"
          placeholder="Enter new field value"
          ref="data"
      />
      <div class="row-1 col-1 container-header">
        <span
            @click="addColumn"
            class="input-group-addon col-1"
        >
          <i class="glyphicon glyphicon-ok"></i>
        </span>
      </div>
    </div>
    <hr>
    <div class="flex-container column-1">
      <div
          class="container-header row-1 input-group field"
          v-for="(column, index) in columns"
          :key="column[0]"
      >
        <input
            v-for="coll in column"
            :key="coll"
            :value="coll"
            class="title form-control col-2"
            disabled
        />

        <div class="row-1 col-1 container-header">
          <span
              @click="deleteColumn(column[0], index)"
              class="input-group-addon col-2 actions"
          >
            <i class="glyphicon glyphicon-remove"></i>
          </span>
        </div>
      </div>
    </div>
    <div v-if="columns.length !== 0">
      <hr>
      <p style="text-transform: uppercase; font-weight: 500">Экспорт в .zip</p>

      <select
          class="form-select form-control"
          id="sel1"
          name="cellist1"
          v-model="selected"
      >
        <option disabled value="">Выберите документ</option>
        <option
            v-for="template in templates"
            :key="template.id"
            :value="template.id"
        >
          {{ template.info.name }}
        </option>
      </select>
      <br>
      <span
          @click="downloadAllZip"
          class="input-group-addon"
      >
        <i class="glyphicon glyphicon-circle-arrow-down"></i>
      </span>
    </div>

    <div v-else class="form">В этой таблице нет ничего</div>
  </div>
</template>


<script>

import { useToast } from "vue-toastification";
export default {
  data() {
    return {
      rows: [], // названием полей
      columns: [], // содержимое полей
      values: {},
      database_name: this.$route.params.database,
      table_name: this.$route.params.table,
      count: 0,
      templates: [],
      selected: ''
    };
  },
  setup() {
    const toast = useToast();
    return {
      toast,
    };
  },
  methods: {
    getCount () {
      return this.count + 1
    },
    async getRows () {
      const query = `db_name=${this.database_name}&table_name=${this.table_name}`
      const request = await fetch(`/api/get_rows_from_table?${query}`);
      if (request.ok) {
        const response = await request.json();
        if (response.status) {

          this.columns = response.data
          this.count = response.data?.slice(-1)?.[0]?.[0] || 0
        }
      }
    },
    async getColumns () {
      const query = `db_name=${this.database_name}&table_name=${this.table_name}`
      const request = await fetch(`/api/get_info_columns_of_table?${query}`);
      if (request.ok) {
        const response = await request.json();
        if (response.status) this.rows = response.data;
      }
    },
    async deleteColumn (id, iindex) {
      const query = `db_name=${this.database_name}&table_name=${this.table_name}&id=${id}`
      const request = await fetch(`/api/delete_row_from_table?${query}`);
      if (request.ok) {
        const response = await request.json();
        if (response.status) {
          this.columns = this.columns.filter((item, index) => {return index !== iindex})
        }
      }
    },
    async updateData(index, row) {
      if (!this.$refs.data[index].value) {
        console.log(this.$refs.data[index].value)
      }
      Object.assign(this.values, {[row]: this.$refs.data[index].value || undefined})
    },
    async addColumn() {
      const json = JSON.parse(JSON.stringify(this.values))
      const keys = Object.keys(json).map((key) => this.values[key])

      if (keys.length !== this.rows.length - 1) {
        this.toast.error("Не все поля заполнены")
        return
      }

      const data = JSON.stringify(this.values)
      const query = `data=${data}&table_name=${this.table_name}&db_name=${this.database_name}`
      const request = await fetch(`/api/add_row_to_table?${query}`);
      if (request.ok) {
        const response = await request.json();
        if (response.status) {
          keys.unshift(this.count + 1)
          this.columns.push(keys)

          this.count ++
        }
      }
    },
    async getTemplatesList() {
      const request = await fetch("/api/get_template_list");
      if (request.ok) {
        const response = await request.json();
        if (response.status) this.templates = response.data;
      }
    },
    async downloadAllZip() {
      const id = this.selected || null;
      const database = this.database_name || null;
      const table = this.table_name || null;

      if (!id) {
        this.toast.error('Missing or invalid template id');
        return;
      }

      if (!database) {
        this.toast.error('Missing database name');
        return;
      }

      if (!table) {
        this.toast.error('Missing table name');
        return;
      }
      const queryParams = new URLSearchParams({ id, database, table });
      window.location.href = `/api/multi_fill_template?${queryParams.toString()}`
    },
  },
  async mounted() {
    await this.getRows()
    await this.getColumns()
    await this.getTemplatesList()
  },
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding-left: 0;
}

.actions {
  margin-right: 6px;
}

.flex-container {
  display: flex;
  align-items: stretch;
}

.container-header {
  display: flex;
}
.container-header input {
  border: none;
  margin-right: 10px;
}
.row-1 {
  flex-direction: row;
}
.column-1 {
  flex-direction: column;
}


.field {
  margin-bottom: 10px;
}
.field div {
}


.col-1 {
  flex: 2
}
.col-2 {
  flex: 3
}

.container-header input:first-child {
  flex: 1;
}

</style>

<template>

  <link
      href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
      rel="stylesheet"
  />
  <div class="flex-container container-header">
        <input
            v-for="row in rows" :key="row"
            class=" col-2 form-control"
            :value="row[1]"
            disabled
        />
    <span
        class="input-group-addon col-1">
      <i class="glyphicon glyphicon-floppy-remove"></i>
    </span>
  </div>
  <hr>
  <div class="flex-container container-header">

    <input disabled :value="getCount()"  class="col-2 form-control"/>

    <input
        v-for="(row, index) in rows.slice(1)" :key="row[1]"
        @keyup='updateData(index, row[1])'
        @blur='updateData(index, row[1])'
        @paste='updateData(index, row[1])'
        @delete='updateData(index, row[1])'
        class="col-2 form-control"
        placeholder="Enter field value"
        ref='data'
    />
    <span
        @click="addColumn"
        class="input-group-addon col-1">
      <i class="glyphicon glyphicon-ok"></i>
    </span>
  </div>
  <hr>
  <div class="flex-container column-1">
    <div class="container-header row-1 input-group field" v-for="(column, index) in columns" :key="column">
      <input
          v-for="coll in column" :key="coll"
          :value="coll"
          class='title form-control col-2'
          disabled
      />
      <span
          @click="deleteColumn(column[0], index)"
          class="input-group-addon col-1"><i class="glyphicon glyphicon-remove"></i>
      </span>
    </div>
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
      count: 0
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
      const request = await fetch(`http://eldorqazwe.online/get_rows_from_table?${query}`);
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
      const request = await fetch(`http://eldorqazwe.online/get_info_columns_of_table?${query}`);
      if (request.ok) {
        const response = await request.json();
        if (response.status) this.rows = response.data;
      }
    },
    async deleteColumn (id, iindex) {
      const query = `db_name=${this.database_name}&table_name=${this.table_name}&id=${id}`
      const request = await fetch(`http://eldorqazwe.online/delete_row_from_table?${query}`);
      if (request.ok) {
        const response = await request.json();
        if (response.status) {
          this.columns = this.columns.filter((item, index) => {return index !== iindex})
          this.count = this.columns?.slice(-1)?.[0]?.[0]
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
      const request = await fetch(`http://eldorqazwe.online/add_row_to_table?${query}`);
      if (request.ok) {
        const response = await request.json();
        if (response.status) {
          keys.unshift(this.count + 1)
          this.columns.push(keys)

          this.count ++
        }
      }
    }
  },
  async mounted() {
    await this.getRows()
    await this.getColumns()
  },
};
</script>

<style scoped>

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

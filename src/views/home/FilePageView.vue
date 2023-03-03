<template>

  <div v-if="file.id">
    <div class="form" v-if="!file.patterns.length">
      Документе отсутствуют поля для редактирования.
      <p
        @click="deleteDocument(this.$route.params.id)"
        style="color: #4cbc89; cursor: pointer; display: contents"
      >
        Удалить?
      </p>
    </div>
    <div v-else>
      <div class="form">
        <label
          :for="pattern.name"
          v-for="(pattern, index) in file.patterns"
          :key="pattern"
        >
          <input
              ref="data"
              :id="pattern.name"
              type="text"
              :placeholder="pattern.desc"
              list="rows"
              required
              :disabled="!rows.length"
              @change="checkOption(index)"
          />
          <datalist id="rows">
            <option v-for="row in rows_copy" :key="row">
              {{row}}
            </option>
          </datalist>
          <span :style="`--index: ${index}`">{{ pattern.desc }}</span>
        </label>
      </div>

      <div
          class="actions"
        style="display: flex; margin-top: 30px"
      >
        <select
            class="form-select form-control"
            id="sel1"
            name="cellist1"
            style="height: inherit;"
            v-model="selected_db"
            @change="getTablesByDatabases"
        >
          <option selected disabled value="">Выберите бд</option>
          <option
              v-for="(database, index) in databases"
              :key="index"
              :value="database"
          >
            {{database}}
          </option>
        </select>
        <select
            :disabled="!this.selected_db"
            class="form-select form-control"
            id="sel1"
            name="cellist1"
            style="height: inherit;"
            v-model="selected_table"

            @keydown="getColumns"
            @keyup='getColumns'
            @blur='getColumns'
            @paste='getColumns'
            @delete='getColumns'
            @change="getColumns"
        >
          <option selected disabled value="">Выберите таблицу</option>
          <option
              v-for="(table, index) in tables"
              :key="index"
              :value="table"
          >
            {{table}}
          </option>
        </select>
        <button
            @click="downloadAllZip"
            class="btn btn-success"
            style="float: left; padding: 12px 20px;"
        >
          Изменить/Скачать
        </button>
      </div>
    </div>
  </div>
  <div v-else class="form">Такого файла не существует</div>
</template>

<script>
import {useToast} from "vue-toastification";

export default {
  data() {
    return {
      file: {},
      databases: [],
      tables: [],
      selected_db: '',
      selected_table: '',
      rows: [],
      rows_copy: [],
      selected: [],
    };
  },
  setup() {
    const toast = useToast();
    return {
      toast,
    };
  },
  methods: {
    checkOption(index) {
      const input = this.$refs.data[index];
      const optionExists = this.rows.includes(input.value)
      if (optionExists === false) {
        this.$refs.data.forEach((data) => {data.value = ''})
        this.selected = []
        input.value = ''
        this.toast.error("Выберите из списка")
      } else {
        this.selected.push(input.value)
      }
      this.rows_copy = this.rows.filter(item => !this.selected.includes(item))
    },
    parseDataFromInput() {
      const jsonData = {};
      for (let field of this.$refs.data) {
        if (field.value !== "")
        jsonData[field.id] = field.value;
      }
      return jsonData;
    },
    async getColumns () {
      const query = `db_name=${this.selected_db}&table_name=${this.selected_table}`
      const request = await fetch(`/api/get_info_columns_of_table?${query}`);
      if (request.ok) {
        const response = await request.json();
        if (response.status) {
          this.rows = response.data.slice(1).map((response) => response[1])
          this.rows_copy = response.data.slice(1).map((response) => response[1])
          this.$refs.data.forEach((data) => {data.value = ''})
        }
      }
    },
    async deleteDocument(id) {
      const request = await fetch(`/api/delete_template?id=${id}`);
      if (request.ok) {
        const response = await request.json();
        console.log(response);
        if (response.status) {
          this.toast.info(
            `Документ №${id} удалён.\nВы будете перенаправлены на главную страницу через 5 секунд`
          );
          setTimeout(() => {
            window.location.href = document.location.origin;
          }, 5000);
        }
      }
    },
    async getTemplateLists () {
      const request = await fetch(
          `/api/get_template_info?id=${this.$route.params.id}`
      );
      if (request.ok) {
        const response = await request.json();
        if (response.status) this.file = response.data;
      }
    },
    async getAllDatabases () {
      const request = await fetch("/api/get_databases");
      if (request.ok) {
        const response = await request.json();
        if (response.status) {
          this.databases = response.data
        }
      }
    },
    async getTablesByDatabases () {
      const request = await fetch(
          `/api/get_tables?db_name=${this.selected_db}`
      );
      if (request.ok) {
        const response = await request.json();
        if (response.status) this.tables = response.data;
      }
    },
    // async downloadAllZipTest() {
    //   const id = this.$route.params.id || null;
    //   const database = this.selected_db || null;
    //   const table = this.selected_table || null;
    //   const dataFromInput = this.parseDataFromInput() || null // this requred query param need validation
    //
    //   if (dataFromInput)
    //   if (!id) {
    //     this.toast.error('Missing or invalid template id');
    //     return;
    //   }
    //
    //   if (!database) {
    //     this.toast.error('Missing database name');
    //     return;
    //   }
    //
    //   if (!table) {
    //     this.toast.error('Missing table name');
    //     return;
    //   }
    //   const queryParams = new URLSearchParams({...dataFromInput, id, database, table });
    //   window.location.href = `/api/multi_fill_template?${queryParams.toString()}`
    // },
    async downloadAllZip() {
      const id = this.$route.params.id || null;
      const database = this.selected_db || null;
      const table = this.selected_table || null;
      const dataFromInput = this.parseDataFromInput(); // this required query param needs validation

      if (!dataFromInput || Object.entries(dataFromInput).length !== this.file.patterns.length) {
        this.toast.error('Missing or invalid input data');
        return;
      }

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

      const queryParams = new URLSearchParams({...dataFromInput, id, database, table });
      window.location.href = `/api/multi_fill_template?${queryParams.toString()}`;
    },
  },
  async mounted() {
    await this.getAllDatabases()
    await this.getTemplateLists()
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  min-height: 100vh;
  display: grid;
  place-content: center;
  font-family: sans-serif;
  color: #6b6b6b;
}
.form {
  width: 100%;
  border: 1px solid #ddd;
  padding: 3vw;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  counter-reset: css-counter 0;
}

.actions > button, select {
  margin-right: 10px;
}
.actions :last-child {
  margin-right: 0;
}

label {
  margin-bottom: 15px;
  position: relative;
  border-bottom: 1px solid #ddd;
}
input {
  width: 100%;
  padding: 10px 0;
  margin-top: 20px;
  border: none;
  outline: none;
}
input::placeholder {
  opacity: 0;
}
span {
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(30px);
  font-size: 0.825em;
  transition-duration: 300ms;
}

label:focus-within > span,
input:not(:placeholder-shown) + span {
  color: green;
  transform: translateY(0px);
}
label span {
  counter-increment: css-counter 1;
}

span:before {
  content: counter(css-counter) ". ";
}
</style>

<template>
  <link
    href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
    rel="stylesheet"
  />
  <div v-if="file.id">
    <div class="form" v-if="!file.patterns.length">
      Документе отсуствуют поля для редактирования.
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
          <input ref="data" :id="pattern.name" type="text" :placeholder="pattern.desc" />
          <span :style="`--index: ${index}`">{{ pattern.desc }}</span>
        </label>
      </div>
      <button
        @click="postData"
        class="btn btn-success"
        style="float: left; padding: 12px 20px; margin-top: 30px"
      >
        Изменить/Скачать
      </button>
    </div>
  </div>
  <div v-else class="form">Такого файла не существует</div>
</template>

<script>
import { useToast } from "vue-toastification";
export default {
  data() {
    return {
      file: {},
    };
  },
  setup() {
    const toast = useToast();
    return {
      toast,
    };
  },
  methods: {
    parseDataFromInput() {
      const jsonData = {};
      for (let field of this.$refs.data) {
        jsonData[field.id] = field.value;
      }
      return { ...jsonData, id: this.$route.params.id };
    },
    async postData() {
      const getJsonData = this.parseDataFromInput();
      const params = new URLSearchParams(getJsonData).toString();
      window.location.href = `http://eldorqazwe.online/fill_template?${params}`;
    },
    async deleteDocument(id) {
      const request = await fetch(`http://eldorqazwe.online/delete_template?id=${id}`);
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
  },
  async mounted() {
    const request = await fetch(
      `http://eldorqazwe.online/get_template_info?id=${this.$route.params.id}`
    );
    if (request.ok) {
      const response = await request.json();
      if (response.status) this.file = response.data;
    }
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

label {
  margin-bottom: 15px;
  position: relative;
  border-bottom: 1px solid #ddd;
}
input {
  width: 100%;
  padding: 10px 0px;
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

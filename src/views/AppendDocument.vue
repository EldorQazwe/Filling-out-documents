<template>
  <input
    id="input"
    ref="file"
    type="file"
    v-show="false"
    v-on:change="setFileName"
    accept=".docx"
  />
  <div style="padding-bottom: 30px">
    <link
      href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <div class="input-group">
      <span class="input-group-addon">
        <i class="glyphicon glyphicon-console"></i>
        {{ this.fileName }}
      </span>
      <input
        :disabled="disabled"
        type="text"
        class="form-control"
        v-model="description"
        :placeholder="disabled ? 'Загрузите файл' : 'Ведите краткое описание файла'"
        minlength="5"
        maxlength="30"
        required
      />
      <span class="input-group-btn">
        <button v-if="!fileName" class="btn btn-success" @click="this.$refs.file.click()">
          Загрузить
        </button>
        <div v-else v-bind:class="{ disabled: loading }">
          <button
            class="btn btn-info"
            @click="commitFile"
            :disabled="!(description.length >= 5 && description.length <= 30)"
          >
            Добавить
          </button>
          <button style="margin-left: 10px" class="btn btn-danger" @click="clear">
            <i class="glyphicon glyphicon-remove-circle"></i>
          </button>
        </div>
      </span>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";
export default {
  data() {
    return {
      fileName: "",
      description: "",
      disabled: true,
      loading: false,
    };
  },
  setup() {
    const toast = useToast();
    return {
      toast,
    };
  },
  methods: {
    setFileName() {
      this.disabled = !this.disabled;
      this.fileName = document.getElementById("input").files.item(0).name;
      this.toast.info(
        `Вы выбрали файл ${this.fileName}\n Теперь введите описание документа`
      );
    },
    clear() {
      this.$refs.file.value = "";
      this.fileName = "";
      this.description = "";
      this.disabled = true;
      this.loading = false;
    },
    async commitFile() {
      let formData = new FormData();
      formData.append("file", this.$refs.file.files[0]);
      formData.append("name", this.fileName);
      formData.append("desc", this.description);
      this.loading = true;
      const request = await fetch(`http://eldorqazwe.online/upload_template`, {
        method: "POST",
        body: formData,
      });

      const response = await request.json();
      if (response.status) {
        this.toast.info(`Вы создали документ №${response.data.id}`);
        this.$emit("create", response.data);
        this.$emit("open", document.getElementById("input"));
        // ПОСЛЕ ОТПРАВКИ ВОЗВРАЩАЕМ К ДЕФОЛТУ
        this.clear();
      } else {
        this.toast.error(`Произошла ошибка, ${response.msg}`);
      }
    },
  },
};
</script>

<style scoped>
.disabled {
  pointer-events: none;
  opacity: 0.5;
}
.button {
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}
.button5 {
  background-color: #555555;
} /* Black */
/* text-field */
.text-field {
  margin-bottom: 1rem;
  text-align: left;
}

.text-field__label {
  display: block;
  margin-bottom: 0.25rem;
}

.text-field__input {
  display: block;
  width: 100%;
  height: calc(2.25rem + 2px);
  padding: 0.375rem 0.75rem;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #bdbdbd;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.text-field__input::placeholder {
  color: #212529;
  opacity: 0.4;
}

.text-field__input:focus {
  color: #212529;
  background-color: #fff;
  border-color: #bdbdbd;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(158, 158, 158, 0.25);
}

.text-field__input:disabled,
.text-field__input[readonly] {
  background-color: #f5f5f5;
  opacity: 1;
}
</style>

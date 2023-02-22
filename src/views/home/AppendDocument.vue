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

</style>

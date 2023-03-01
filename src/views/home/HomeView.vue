<template>
  <AppendDocument @create="createDocument"></AppendDocument>
  <div v-show="!files.length" class="form">
    Документы отсуствуют.
    <p @click="openUploadFile" style="color: #4cbc89; cursor: pointer; display: contents">
      Загрузить?
    </p>
  </div>
  <div class="flex wrap card__wrapper">
    <div class="card" v-for="file in files" :key="file.id">
      <button @click="deleteDocument(file.id)" class="btn-delete">
        <span class="glyphicon glyphicon-floppy-remove" style="font-size: 18px"></span>
      </button>
      <RouterLink :to="{ name: 'file', params: { id: file.id } }">
        <div><img src="@/assets/docx.png" class="avatar" /></div>
        <div class="test">
          <h4 class="card__name">{{ file.info.name }}</h4>
          <p>{{ file.info.desc }}</p>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import AppendDocument from "./AppendDocument.vue";
import { useToast } from "vue-toastification";
export default {
  name: "HomeView",
  components: {
    RouterLink,
    AppendDocument,
  },
  setup() {
    const toast = useToast();
    return {
      toast,
    };
  },
  data() {
    return {
      files: [],
    };
  },
  methods: {
    createDocument(document) {
      this.files.push(document);
    },
    openUploadFile() {
      document.getElementById("input").click();
    },
    async deleteDocument(id) {
      const request = await fetch(`/api/delete_template?id=${id}`);
      if (request.ok) {
        const response = await request.json();
        if (response.status) {
          this.files = this.files.filter((file) => file.id != id);
          this.toast.info(`Документ №${id} удалён`);
        }
      }
    },
  },
  async mounted() {
    const request = await fetch("/api/get_template_list");
    if (request.ok) {
      const response = await request.json();
      if (response.status) this.files = response.data;
    }
  },
};
</script>

<style scoped>

</style>

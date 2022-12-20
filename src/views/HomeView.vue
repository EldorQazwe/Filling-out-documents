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
      const request = await fetch(`http://eldorqazwe.online/delete_template?id=${id}`);
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
    const request = await fetch("http://eldorqazwe.online/get_template_list");
    if (request.ok) {
      const response = await request.json();
      if (response.status) this.files = response.data;
    }
  },
};
</script>

<style scoped>
.card__wrapper {
  position: relative;
}

.btn-delete {
  position: absolute;
  z-index: 1;
  left: 0;
  padding: 10px;
  margin: 10px;
  top: 0;
  border-radius: 100px;
  color: white;
  background: red;
  border: none;
  width: 50px;
  height: 50px;
}

.card__name {
  font-size: 20px;
  font-weight: 600;
  text-transform: capitalize;
}
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  width: 300px;
  height: 300px;
  padding: 20px;
  border-radius: 5px;
  margin-right: 30px;
  margin-bottom: 30px;
}
.card:last-child {
  margin-right: 0px;
}

.card .test {
  text-align: left;
}
.card .avatar {
  text-align: center;
  width: 150px;
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}
.card:hover .test {
  color: #4dbd8a;
}

img {
  width: 100%;
}
</style>

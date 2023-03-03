<template>
  <link
      href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
      rel="stylesheet"
  />
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/databases">База данных</router-link>
  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 1440px; margin: 0 auto;
}

nav {
  padding: 30px;
  text-align: left;
  box-shadow: 0 1px 1px 0 rgba(0,0,0,0.2);
  margin: 30px 0
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  padding: 10px 20px;
}

nav a.router-link-exact-active {
  color: #42b983;
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
  margin-right: 0;
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

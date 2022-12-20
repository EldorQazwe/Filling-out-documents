<template>
  <nav>
    <router-link to="/">Home</router-link>
  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 1440px; margin: 0 auto;
}

nav {
  padding: 30px;
  text-align: left;
  box-shadow: 0px 1px 1px 0 rgba(0,0,0,0.2);
  margin: 30px 0px
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  padding: 10px 20px;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.flex {
  display: flex;
}
.wrap {
  flex-wrap: wrap;
}
</style>

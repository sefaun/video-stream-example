<template>
  <div>
    <video controls autoPlay width="600" height="500">
      <source src="http://localhost:6000/api/v1/video-stream" type="video/mp4" />
      Your browser does not support HTML5 video tags.
    </video>
  </div>
</template>

<script>
export default {};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

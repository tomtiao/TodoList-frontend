<template>
  <div class="toast" :class="classObject">
    <p class="text">{{ messageObject.message }}</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    messageObject: {
      type: Object,
      required: true,
      default: function () {
        return {
          message: '',
          error: false
        }
      }
    }
  },
  computed: {
    classObject: function (): Record<string, unknown> {
      return {
        info: !this.messageObject.error,
        danger: this.messageObject.error
      }
    }
  }
})
</script>

<style scoped>
.toast {
  position: absolute;
  height: 60px;
  background-color: #eee;
}
.info {
  color: white;
  background-color: yellowgreen;
}
.danger {
  color: white;
  background-color: orangered;
}
</style>

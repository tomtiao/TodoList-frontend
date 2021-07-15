<template>
  <div class="toast" :class="classObject">
    <p class="text">{{ messageObject.message }}</p>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
interface Message {
  message: string;
  error: boolean;
}
export default Vue.extend({
  props: {
    messageObject: {
      type: Object as PropType<Message>,
      required: true
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

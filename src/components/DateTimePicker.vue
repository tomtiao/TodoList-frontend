<template>
  <div class="datetime-picker">
    <div class="date-section">
      <label :for="`reminder-date-${uid}`">{{ text.date }}</label>
      <input
        type="date"
        name="reminder-date"
        :id="`reminder-date-${uid}`"
        v-model="date"
      />
    </div>
    <div class="time-section">
      <label :for="`reminder-date-${uid}`">{{ text.time }}</label>
      <input
        type="time"
        name="reminder-time"
        :id="`reminder-time-${uid}`"
        v-model="time"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
let uid = 0
export default Vue.extend({
  created () {
    this.uid = uid
    uid += 1
  },
  props: {
    initialTimestamp: {
      required: true,
      validator: function (v) {
        return v === null || typeof v === 'number'
      }
    }
  },
  data () {
    return {
      text: {
        date: '日期',
        time: '时间'
      },
      uid: uid,
      timestamp: this.initialTimestamp as number
    }
  },
  computed: {
    date: {
      get (): string {
        if (this.timestamp === null) {
          return ''
        } else {
          const [month, day, year] = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })
            .format(new Date(this.timestamp)).split('/')

          const twoDigitsMonth = (+month < 10) ? `0${month}` : month

          return `${year}-${twoDigitsMonth}-${day}`
        }
      },
      set (val: string) {
        const [fullYear, month, day] = val.split('-')
        const t = this.timestamp === null ? new Date() : new Date(this.timestamp)
        t.setFullYear(+fullYear, (+month - 1), +day) // month is zero-based
        this.timestamp = t.getTime()
        this.$emit('update:initialTimestamp', this.timestamp)
      }
    },
    time: {
      get: function (): string {
        return this.timestamp === null ? '' : Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: false }).format(new Date(this.timestamp))
      },
      set: function (val: string) {
        const [hour, minute] = val.split(':')
        const t = this.timestamp === null ? new Date() : new Date(this.timestamp)
        t.setHours(+hour, +minute)
        this.timestamp = t.getTime()
        this.$emit('update:initialTimestamp', this.timestamp)
      }
    }
  },
  watch: {
    initialTimestamp: function (newVal) {
      this.timestamp = newVal
    }
  }
})
</script>

<style scoped>
.datetime-picker {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
}
</style>

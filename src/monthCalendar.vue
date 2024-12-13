<template>
  <tiny-calendar-view :events="eventslist" :year="2024" :month="12"></tiny-calendar-view>
</template>
  
  <script lang="ts">
  import { addDays, isYesterday } from 'date-fns'
  import { defineComponent, ref } from 'vue'
  import { TinyCalendarView } from '@opentiny/vue'

  export default defineComponent({
    components: {TinyCalendarView},
    setup() {
      let eventslist = ref([
        {
          title: '前端周会1',
          start: '2024-12-15 8:30:00',
          end: '2024-12-15 9:00:00',
          content: '日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注',
          theme: 'blue'
        },
        {
          title: '前端周会2',
          start: '2024-12-15 10:00:00',
          end: '2024-12-15 12:00:00',
          content: '日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注',
          theme: 'green'
        },
        {
          title: '前端周会2-1',
          start: '2024-12-15 13:00:00',
          end: '2024-12-15 15:00:00',
          content: '日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注',
          theme: 'red'
        },
        {
          title: '前端周会3',
          start: '2024-12-16 9:00:00',
          end: '2024-12-16 10:00:00',
          content: '日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注',
          theme: 'yellow'
        },
        {
          title: '前端周会4',
          start: '2024-12-16 11:00:00',
          end: '2024-12-16 14:00:00',
          content: '日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注',
          theme: 'purple'
        },
        {
          title: '前端周会5',
          start: '2024-12-25 8:00:00',
          end: '2024-12-25 9:00:00',
          content: '日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注',
          theme: 'cyan'
        },
        {
          title: '前端周会6',
          start: '2024-12-26 8:00:00',
          end: '2024-12-26 11:30:00',
          content: '日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注',
          theme: 'blue'
        },
        {
          title: '前端周会7',
          start: '2024-12-27 8:30:00',
          end: '2024-12-27 9:30:00',
          content: '日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注',
          theme: 'blue'
        },
        {
          title: '节假日25-28',
          start: '2024-12-25 10:30:00',
          end: '2024-12-28 03:30:00',
          content: '日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注日程备注',
          theme: 'green'
        }
      ])
      return {
        eventslist
      }
    }
  })
  </script>
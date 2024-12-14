<template>
  <tiny-calendar-view :events="eventslist" :year="yearCurrent" :month="monthCurrent"></tiny-calendar-view>
</template>
  
  <script lang="ts">
  import { addDays, isYesterday } from 'date-fns'
  import { defineComponent, ref, toRef } from 'vue'
  import { TinyCalendarView } from '@opentiny/vue'

  export default defineComponent({
    components: {TinyCalendarView},
    props: {
      taskList: Array
    },
    setup(props: {}) {
      let eventslist = toRef(props, 'taskList')
      // 获取当前日期对象
      const now = new Date();

      // 获取当前年份
      const year = now.getFullYear();

      // 获取当前月份，月份是从0开始的，所以需要加1
      const month = now.getMonth() + 1;

      console.log(`当前年份：${year}`);
      console.log(`当前月份：${month}`);
      let yearCurrent = ref(year), monthCurrent = ref(month)
      return {
        eventslist,
        yearCurrent,
        monthCurrent
      }
    }
  })
  </script>
  <style>
.tiny-calendar-view .tiny-calendar-view-month__main .main-container > ul > li{
 height: auto;
 max-height: 150px; 
 min-height: 70px;
}
</style>
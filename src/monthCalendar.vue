<template>
  <tiny-calendar-view :events="showEventList" :year="yearCurrent" :month="monthCurrent" 
    @month-change="monthChange" @mode-change="modeChange" @week-change="weekChange" @year-change="yearChange" @selected-date-change="selectedDateChange"
  >
    <template #header="{ slotScope }">
      <p>{{ slotScope.date }}{{ slotScope.weekDay }}</p>
    </template>
  </tiny-calendar-view>
</template>
  
  <script lang="ts">
  import { addDays, isYesterday } from 'date-fns'
  import { defineComponent, ref, toRef, computed } from 'vue'
  import { TinyCalendarView } from '@opentiny/vue'
  import {IconRichTextListUnordered} from '@opentiny/vue-icon'
  import eventBus from './eventBus'

  export default defineComponent({
    components: {TinyCalendarView},
    props: {
      taskList: Array
    },
    emits: ['show-time-line-action'],
    setup(props: {}, {emit}) {
      let eventslist = toRef<object[]>(props, 'taskList')
      // 获取当前日期对象
      const now = new Date();

      // 获取当前年份
      const year = now.getFullYear();

      // 获取当前月份，月份是从0开始的，所以需要加1
      const month = now.getMonth() + 1;

      console.log(`当前年份：${year}`);
      console.log(`当前月份：${month}`);
      interface TaskFormat {
        title: string,
        start: string,
        end: string,
        content: string,
        theme: string
      }
      let yearCurrent = ref(year), monthCurrent = ref(month)

      
      let showEventList = computed(() => {
        return eventslist.value.filter((item: TaskFormat) => {
          let yearMonth = item.start.split(' ')[0].split('-')
          return Number(yearMonth[0]) == yearCurrent.value && Number(yearMonth[1]) == monthCurrent.value
        })
      })
      function monthChange(newVal: string, oldVal: string) {
        monthCurrent.value = Number(newVal)
      }
      function yearChange(newVal: string) {
        yearCurrent.value = Number(newVal)
      }
      function modeChange(val: string) {
        showTimeLineAction(false)
      }
      function weekChange(weekDate: []) {
      }

      const timeLineIcon = IconRichTextListUnordered()

      function showTimeLineAction(type: boolean) {
        emit('show-time-line-action', type)
      }
      function selectedDateChange(date: any) {
        eventBus.emit('dateChange', date)
      }
      return {
        eventslist,
        yearCurrent,
        monthCurrent,
        monthChange,
        yearChange,
        modeChange,
        weekChange,
        showEventList,
        timeLineIcon,
        showTimeLineAction,
        selectedDateChange
      }
    }
  })
  </script>
  <style>
.tiny-calendar-view .tiny-calendar-view-month__main .main-container > ul{
  min-height: 100px;
}
.tiny-calendar-view .tiny-calendar-view-month__main .main-container > ul > li{
 height: auto;
 max-height: 140px; 
 min-height: 120px;
}
.icon-timeline{
  font-size: 18px;
  color: #191919;
  padding: 10px;
  display: inline-block;
}
.events-item{
  min-height: 30px;
  overflow: auto;
}
.tiny-calendar-view .tiny-calendar-view-week__timeline .day-times ul > li{
  height: 30px;
}
ul>li{
  min-height: 2em;
}
.tiny-calendar-view{
  height: 100%;
  overflow: hidden;
}
.tiny-calendar-view-week{
  height: calc(100% - 70px);
}
.tiny-calendar-view .tiny-calendar-view-week__timeline, .tiny-calendar-view .tiny-calendar-view-week__schedule{
  height: 100%;
}
</style>
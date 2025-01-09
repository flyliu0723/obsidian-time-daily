<template>
    <div class="page-container">
        <tiny-tabs v-model="activeName" tab-style="button-card" size="small">
            <tiny-tab-item :key="item.name" v-for="item in tabs" :title="item.title" :name="item.name"> 
                
                <tiny-time-line text-position="right" show-divider="true" vertical v-if="item.name == '1'">
                    <tiny-timeline-item v-for="(item, i) in todayEventList" :key="i" :node="item" :nodeIndex="i">
                        <template #left>
                            <div class="my-time">
                                {{ item.time.slice(5) }}
                            </div>
                        </template>
                        <template #right>
                            <div class="my-description" :class="[item.theme]">
                                <p>{{ item.content }}</p>
                            </div>
                        </template>
                    </tiny-timeline-item>
                </tiny-time-line>
                <tiny-time-line text-position="right" show-divider="true" vertical v-else-if="item.name == '2'">
                    <tiny-timeline-item v-for="(item, i) in todayMemo" :key="i" :node="item" :nodeIndex="i">
                        <template #left>
                            <div class="my-time">
                                {{ item.date.slice(5) }} {{ item.time }}
                            </div>
                        </template>
                        <template #right>
                            <div class="my-description">
                                <p>{{ item.mainContent }}</p>
                                <p>{{ item.tags.join() }}</p>
                            </div>
                        </template>
                    </tiny-timeline-item>
                </tiny-time-line>
            </tiny-tab-item>
        </tiny-tabs>
    </div>
</template>
<script>
import { defineComponent, ref, toRef, computed, reactive, onBeforeUnmount } from 'vue'
import {IconChevronLeft} from '@opentiny/vue-icon'
import { TinyTabs, TinyTabItem, TinyTimeLine, TinyTimelineItem } from '@opentiny/vue'
import eventBus from './eventBus'
export default defineComponent({
    components: { TinyTabs, TinyTabItem, TinyTimeLine, TinyTimelineItem },
    props: {
        taskList: Array,
        memoList: Array
    },
    emits: ['show-time-line-action'],
    setup(props, {emit}) {
        const activeName = ref('1')
        const tabs = reactive([{
            title: 'Today Tasks',
            name: '1'
        }, {
            title: 'Something',
            name: '2'
        }])

        let eventslist = toRef(props, 'taskList'), memosList = toRef(props, 'memoList')
        // 获取当前日期对象
        const now = new Date();

        // 获取当前年份
        const year = now.getFullYear();

        // 获取当前月份，月份是从0开始的，所以需要加1
        const month = now.getMonth() + 1;

        const day = now.getDate()

        let yearCurrent = ref(year), monthCurrent = ref(month), dayCurrent = ref(day)
        function changeDate(date) {
            let dateArr = date.split('-')
            yearCurrent.value = Number(dateArr[0])
            monthCurrent.value = Number(dateArr[1])
            dayCurrent.value = Number(dateArr[2])
        }
        eventBus.on('dateChange', changeDate)
        onBeforeUnmount(() => {
            eventBus.off('dateChange', changeDate)
        })
        // 根据年月日筛选对应日期的事件
        let todayEventList = computed(() => {
            return eventslist.value.filter((item) => {
                let yearMonthDay = item.start.split(' ')[0].split('-')
                return Number(yearMonthDay[0]) == yearCurrent.value && Number(yearMonthDay[1]) == monthCurrent.value && Number(yearMonthDay[2]) == dayCurrent.value
            }).map(item => {
                return {
                    ...item,
                    time: item.end || item.start
                }
            })
        })
        let todayMemo = computed(() => {
            let result = memosList.value.filter((item => {
                let yearMonthDay = item.date.split('-')
                return Number(yearMonthDay[0]) == yearCurrent.value && Number(yearMonthDay[1]) == monthCurrent.value && Number(yearMonthDay[2]) == dayCurrent.value
            }))
            console.log(result, 111222)
            return result.map(item => {
                return {
                    ...item,
                    time: item.date
                }
            })
        })

        const activeTime = ref(1)
        function clickTimeItem(index) {
            activeTime.value = index
        }

        const backActionIcon = IconChevronLeft()
        function hideTimeLine() {
            emit('show-time-line-action', false)
        }
        return {
            todayEventList,
            todayMemo,
            backActionIcon,
            hideTimeLine,
            activeName,
            tabs,
            clickTimeItem,
            activeTime
        }
    }
})
</script>
<style>
.page-container {
    width: 100%;
    height: 100%;
    overflow: auto;
}
.tiny-timeline-item__pillar{
    margin: 0 20px;
}
.tiny-timeline .tiny-steps-timeline .timeline{
    align-items: center;
    justify-content: flex-start;
    margin: 0 30px;
    padding-bottom: 0;
}
.timeline::after{
    width: 0;
}
.my-description{
    padding: 20px;
    color: #4b4f4f;
    width: 250px;
    border-radius: 4px;
    margin-bottom: 20px;
}
.my-description.blue {
    background: #eaf8fe;
    border-left: #a1e0ff 5px solid;
}
.my-description.green {
    background: #edfbfa;
    border-left: #8fe5df 5px solid;
}
.my-description.red {
    background: #fff2f6;
    border-left: #f79ab5 5px solid;
}
.my-description p{
    margin: 2px 0;
}
.my-description p.tag{
    color: #7fa0fb;
}
.back-icon{
    display: inline-block;
    font-size: 20px;
    width: 20px;
    height: 20px;
}
</style>
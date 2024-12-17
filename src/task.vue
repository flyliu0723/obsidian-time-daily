<template>
    <div class="page-container">
        <div>
            <back-action-icon class="back-icon" @click="hideTimeLine"/>
        </div>
        <tiny-time-line text-position="right" show-divider="true" vertical>
            <tiny-timeline-item v-for="(item, i) in todayEventList" :key="i" :node="item" :nodeIndex="i">
                <template #left>
                    <div class="my-time">
                        {{ item.time }}
                    </div>
                </template>
                <template #right>
                    <div class="my-description" :class="[item.theme]">
                        <p class="tag">{{item.tag}}</p>
                        <p>{{ item.content }}</p>
                    </div>
                </template>
            </tiny-timeline-item>
        </tiny-time-line>
    </div>
</template>
<script>
import { defineComponent, ref, toRef, computed } from 'vue'
import { TinyTimeLine, TinyTimelineItem } from '@opentiny/vue'
import {IconChevronLeft} from '@opentiny/vue-icon'
export default defineComponent({
    components: { TinyTimeLine, TinyTimelineItem },
    props: {
        taskList: Array
    },
    emits: ['show-time-line-action'],
    setup(props, {emit}) {
        let eventslist = toRef(props, 'taskList')
        // 获取当前日期对象
        const now = new Date();

        // 获取当前年份
        const year = now.getFullYear();

        // 获取当前月份，月份是从0开始的，所以需要加1
        const month = now.getMonth() + 1;

        const day = now.getDate()

        let yearCurrent = ref(year), monthCurrent = ref(month), dayCurrent = ref(day)
        // 根据年月日筛选对应日期的事件
        let todayEventList = computed(() => {
            return eventslist.value.filter((item) => {
                let yearMonthDay = item.start.split(' ')[0].split('-')
                return Number(yearMonthDay[0]) == yearCurrent.value && Number(yearMonthDay[1]) == monthCurrent.value && Number(yearMonthDay[2]) == dayCurrent.value
            }).map(item => {
                return {
                    ...item,
                    time: item.start
                }
            })
        })
        const backActionIcon = IconChevronLeft()
        function hideTimeLine() {
            emit('show-time-line-action', false)
        }
        return {
            todayEventList,
            backActionIcon,
            hideTimeLine
        }
    }
})
</script>
<style>
.page-container {}
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
    height: 80px;
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
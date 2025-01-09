<template>
    <div id="heatmap">
        <div class="months">
            <span>一</span>
            <span>二</span>
            <span>三</span>
            <span>四</span>
            <span>五</span>
            <span>六</span>
            <span>七</span>
            <span>八</span>
            <span>九</span>
            <span>十</span>
            <span>十一</span>
            <span>十二</span>
        </div>
        <div class="days" id="daysContainer">
            <!-- 格子将通过 JavaScript 动态生成 -->
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, defineProps, toRef, inject } from "vue";
export default defineComponent({
    setup() {

        function getDaysInCurrentYear(): number {
            const currentYear = new Date().getFullYear();
            return isLeapYear(currentYear) ? 366 : 365;
        }

        function isLeapYear(year: number): boolean {
            // 如果年份能被 4 整除，但不能被 100 整除，或者能被 400 整除，则是闰年
            return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        }


        onMounted(() => {
            const daysContainer = document.getElementById('daysContainer') as HTMLDivElement;
            const daysInCurrentYear = getDaysInCurrentYear();
            const data: number[] = Array(daysInCurrentYear).fill(0);  // 示例数据，假设每天的贡献值为 0
            
            console.log(`当前年份的天数是: ${daysInCurrentYear}`);
            // 生成 ${daysInCurrentYear} 天的格子
            for (let i = 0; i < daysInCurrentYear; i++) {
                const day = document.createElement('div');
                day.classList.add('day');
                daysContainer.appendChild(day);
            }

            // 假设 data 数组中存储了每天的贡献值
            data.forEach((value, index) => {
                const day = document.querySelector(`#daysContainer .day:nth-child(${index + 1})`) as HTMLDivElement;
                if (value > 0) {
                    const color = `rgba(0, 128, 0, ${value / 100})`;  // 根据贡献值调整颜色
                    day.style.backgroundColor = color;
                }
            });
        })
    }
})
</script>
<style scoped>
#heatmap {
    display: grid;
    grid-template-columns: repeat(12, 21px);
    /* 12 个月份，每个 21px 宽 */
    grid-template-rows: 21px repeat(53, 21px);
    /* 1 行月份标签 + 53 行天数格子 */
    gap: 2px;
    /* 格子之间的间隙 */
}

.months {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #aaa;
}

.days {
    display: grid;
    grid-template-columns: repeat(7, 21px);
    /* 每周 7 天 */
    grid-template-rows: repeat(53, 21px);
    /* 53 周的格子 */
}

.days div {
    background-color: #eaeaea;
    border-radius: 3px;
}
</style>
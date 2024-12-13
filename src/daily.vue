<template>
    <div class="daily-container">
        <div class="content">
            <month-calendar/>
        </div>
    </div>
</template>
</style>
<script lang="ts">
import {App, TFile} from 'obsidian'
import { defineComponent, ref, onMounted, defineProps, toRef, inject } from "vue";
import monthCalendar from './monthCalendar.vue'
import {myAppInterface} from './interfaces'
export default defineComponent({
    name: "Daily",
    components: {
        monthCalendar,
    },
    setup(props: myAppInterface) {
        interface Times {
            year: number,
            month: number[]
        }
        interface DailyFile {
            todos: {
                type: object[]
            }
        }
        const myApp = inject<myAppInterface>('myApp') || {
            vault: {
                getAbstractFileByPath: Function,
                read: Function
            }
        };
        let dailyList = ref<DailyFile[]>([]), timesRef = ref<Times[]>([])
        console.log(myApp, 123333)
        onMounted(async () => {
            let files = myApp.vault.getAbstractFileByPath('01Inbox/daily').children.filter((item: TFile) => item.name != 'archives')
            // .map((item: TFile) => ({...item, todos: []}));
            
            files.forEach(async (file: any) => {
                if (file && file.path) {
                    try {
                        const fileContent = await myApp.vault.read(file);
                        console.log(fileContent)
                        const todos = parseTodos(fileContent);
                        console.log(todos); // 打印所有待办事项到控制台
                        file.todos = todos || []
                    } catch (error) {
                        console.error('Error reading file:', error);
                    }
                }
            })
            dailyList.value = files;
            console.log(dailyList.value)
            formatTime()
        })
        function parseTodos(content: string): string[] {
            const regex = /- \[([x ])\] .*/g;

            const matches = content.match(regex);

            if (matches) {
                return matches;
            } else {
                return []
            }
        }
        function formatTime() {
            let times: string[] = [...new Set(dailyList.value.map((d: any) => d.basename))].filter((d: string) => isValidDate(d))
            extractYearsAndMonths(times)
        }
        function extractYearsAndMonths(dates: string[]) {
            const result = new Map<number, { year: number, month: number[] }>();

            dates.forEach((date: string) => {
                const match = date.match(/(\d{4})-(\d{2})-\d{2}/);
                if (match) {
                    const year = parseInt(match[1], 10);
                    const month = parseInt(match[2], 10);

                    if (result.has(year)) {
                        if (!result.get(year)?.month.includes(month)) {
                            result.get(year)?.month.push(month);
                        }
                    } else {
                        result.set(year, { year, month: [month] });
                    }
                }
            });

            timesRef.value = Array.from(result.values());
        }
        function isValidDate(str: string) {
            // 正则表达式匹配 YYYY-MM-DD 格式
            const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
            return regex.test(str);
        }

    }
})
</script>

<style scoped>
.sample-class {
    margin-left: 1em;
    color: #6C31E3;
}
.daily-container{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    border: solid 1px #f0f5f9;
    padding: 10px 0;
}
.filter-box{
    width: 100%;
    height: 60px;
}
.daily-container .content{
    flex: 1;
    height: 100%;
}



.daily-container .years-box{
    height: 100%;
    display: inline-flex;
    flex-direction: column;
    padding-left: 5px;
}
.daily-container .years-box span{
    display: inline-block;
    width: 30px;
    height: 75px;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    color: #393e46;
    text-align: center;
    word-break: break-all;
    padding: 2px 7px;
    line-height: 1;
    font-size: 16px;
    cursor: pointer;
    margin-bottom: 5px;
    margin-left: 5px;
}
.daily-container .years-box span.active {
    width: 35px;
    padding: 3px 10px;
    margin-left: 0;
}
</style>
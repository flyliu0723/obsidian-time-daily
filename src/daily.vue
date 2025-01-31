<template>
    <div class="daily-container">
        <div class="content">
            <month-calendar :taskList="taskList" @show-time-line-action="showTimeLineAction"/>
        </div>
        <div class="task">
            <task :taskList="taskList" :memoList="memoList"  @show-time-line-action="showTimeLineAction"/>
        </div>
    </div>
</template>
</style>
<script lang="ts">
import { App, TFile } from 'obsidian'
import { defineComponent, ref, onMounted, defineProps, toRef, inject } from "vue";
import monthCalendar from './monthCalendar.vue'
import task from './task.vue'
import { myAppInterface } from './interfaces'
export default defineComponent({
    name: "Daily",
    components: {
        monthCalendar, task
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
        let renderCanledar = ref<boolean>(false);
        let dailyList = ref<DailyFile[]>([]), timesRef = ref<Times[]>([]), taskList = ref<object[]>([]), memoList = ref<object[]>([]);
        onMounted(async () => {
            let files = myApp.vault.getAbstractFileByPath('01Inbox/daily').children.filter((item: TFile) => item.name != 'archives')
            // .map((item: TFile) => ({...item, todos: []}));
            let realFiles: any[] = []
            formatRealFile(files, realFiles)
            let allTodos: Object[] = [], allMemos: Object[] = []
            realFiles.forEach(async (file: any, index: number) => {
                if (file && file.path) {
                    try {
                        const fileContent = await myApp.vault.read(file);
                        const todos = parseTodos(fileContent, file.name.replace('.md', ''));
                        const memos = parseMemoContent(fileContent, file.name.replace('.md', ''));
                        file.todos = todos || []
                        allMemos = [...allMemos, ...memos]
                        allTodos = [...allTodos, ...todos]
                        if(index == realFiles.length - 1) {
                            taskList.value = allTodos
                            dailyList.value = realFiles;
                            memoList.value = allMemos
                            renderCanledar.value = true
                            console.log(memoList)

                        }
                    } catch (error) {
                        console.error('Error reading file:', error);
                    }
                }
            })
            formatTime()
        })
        function formatRealFile(files: [], result: any[]) {
            files.forEach((item: any) => {
                if(item.children && item.children.length) {
                    formatRealFile(item.children, result)
                }else {
                    result.push(item)
                }
            })
        }
        function parseTodos(content: string, date: string): TaskFormat[] {
            const regex = /- \[([x ])\] .*/g;

            let matches = content.match(regex);
            if (matches) {
                let result: TaskFormat[] = matches.map((item: string) => formatTask(item, date));
                
                return result
            } else {
                return []
            }
        }

        function parseMemoContent(markdownContent: string, date: string) {
            // 使用正则表达式匹配到memo标题内的内容
            const memoContentMatch = markdownContent.match(/## memo\n(.*?)(?=\n##|\n---|$)/s);
            if (!memoContentMatch) {
                return [];
            }

            const memoContent = memoContentMatch[1].trim();
            const memoItems = [];

            // 使用正则表达式匹配到每个时间点的内容
            const timeContentMatches = memoContent.matchAll(/- (\d{2}:\d{2})\s+(.*?)(?=\n- \d{2}:\d{2}|\n##|\n---|$)/gs);

            for (const match of timeContentMatches) {
                const time = match[1];
                const content = match[2].trim();

                // 提取标签
                const tagsMatch = content.match(/#(\S+)/g);
                const tags = tagsMatch ? tagsMatch.map(tag => tag.trim()) : [];

                // 提取主要内容，去除标签
                const mainContent = content.replace(/#(\S+)/g, '').trim();

                memoItems.push({
                    date,
                    time,
                    mainContent,
                    tags
                });
            }

            return memoItems;
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

        interface TaskFormat {
            title: string,
            start: string,
            end: string,
            content: string,
            theme: string,
            tag: string
        }
        interface TaskColos {
            [key: string]: string;
            work: 'blue';
            learn: 'green';
            life: 'red';
            study: 'yellow';
            other: 'purple';
            daily: 'pink';
        }

        let taskColos:TaskColos = {
            'work': 'blue',
            'learn': 'green',
            'life': 'red',
            'study': 'yellow',
            'other': 'purple',
            'daily': 'pink'
        }
        function formatTask(input: string, date: string): TaskFormat {
            // 正则表达式匹配带时间范围的字符串（兼容已完成待办）
            const withTimeRangeRegex = /- \[([ x])\] (\d{2}:\d{2}) - (\d{2}:\d{2}) (.+?) #(\w+)\/(\w+)/; 
            // 正则表达式匹配带单个时间点的字符串（兼容已完成待办）
            const withSingleTimeRegex = /- \[([ x])\] (\d{2}:\d{2}) (.+?) #(\w+)\/(\w+)/;
            // 正则表达式匹配不带时间的字符串（兼容已完成待办）
            const withoutTimeRegex = /- \[([ x])\] (.+?) #(\w+)\/(\w+)/;

            let match: RegExpMatchArray | null;

            match = input.match(withTimeRangeRegex);
            if (match) {
                // 如果匹配到带时间范围的字符串
                return {
                    title: `${match[4].trim()}`.slice(0, 15), // 返回task/work格式的title
                    start: date + ' ' + match[2],
                    end: date + ' ' + match[3],
                    content: `${match[4].trim()}  ${match[6]}`,
                    theme: taskColos[match[6]] || 'pink',
                    tag: match[6]
                };
            } else {
                match = input.match(withSingleTimeRegex);
                if (match) {
                    // 如果匹配到带单个时间点的字符串
                    return {
                        title: `${match[3].trim()}`.slice(0, 15), // 返回task/work格式的title
                        start: date + ' ' + match[2],
                        end: date + ' ' + match[2],
                        content: `${match[3].trim()}  ${match[5]}`,
                        theme: taskColos[match[5]] || 'pink',
                        tag: match[5]
                    };
                } else {
                    match = input.match(withoutTimeRegex);
                    if (match) {
                        // 如果匹配到不带时间的字符串
                        return {
                            title: `${match[1].trim()}`.slice(0, 15), // 返回task/work格式的title
                            start: date,
                            end: date,
                            content: `${match[1].trim()}  ${match[4]}`,
                            theme: taskColos[match[4]] || 'pink',
                            tag: match[4]
                        };
                    } else {
                        // 如果都不匹配，抛出错误
                        throw new Error('输入的字符串不符合预期格式');
                    }
                }
            }
        }
        let showTimeLine = ref<boolean>(false)
        function showTimeLineAction(type: boolean) {
            showTimeLine.value = type
        }

        // 获取当前日期对象
        const now = new Date();

        // 获取当前年份
        const year = now.getFullYear();

        // 获取当前月份，月份是从0开始的，所以需要加1
        const month = now.getMonth() + 1;

        console.log(`当前年份：${year}`);
        console.log(`当前月份：${month}`);

        return {
            taskList,
            memoList,
            renderCanledar,
            showTimeLine,
            showTimeLineAction,
        }
    }
})
</script>

<style scoped>
.sample-class {
    margin-left: 1em;
    color: #6C31E3;
}

.daily-container {
    width: 100%;
    height: 100%;
    display: flex;
    border: solid 1px #f0f5f9;
    padding: 10px 0;
}

.filter-box {
    width: 100%;
    height: 60px;
}

.daily-container .content {
    flex: 1;
    height: 100%;
    display: inline-block;
}
.daily-container .task{
    width: 350px;
    height: 100%;
    display: inline-block;
}


.daily-container .years-box {
    height: 100%;
    display: inline-flex;
    flex-direction: column;
    padding-left: 5px;
}

.daily-container .years-box span {
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
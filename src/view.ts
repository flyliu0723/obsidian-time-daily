import { ItemView, WorkspaceLeaf, App } from "obsidian";
// import TDesign from 'tdesign-vue-next';
// 引入组件库的少量全局样式变量
// import 'tdesign-vue-next/es/style/index.css';

// 引入 @opentiny/vue 组件
// import TinyVue from '@opentiny/vue'
import { createApp } from "vue";
import daily from './daily.vue';
import {myAppInterface} from './interfaces'

export const VIEW_TYPE_EXAMPLE = "example-view";

export class ExampleView extends ItemView {
    myApp: App;
  constructor(leaf: WorkspaceLeaf, app: App) {
    super(leaf);
    this.myApp = app
  }
// 设置图标的方法
  setIcon() {
    this.icon = 'dice'; //项卡以反映新的图标
  }
  getViewType() {
    return VIEW_TYPE_EXAMPLE;
  }

  getDisplayText() {
    return "my task daily";
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.setText("Hello world");
    this.setIcon()
    const app = createApp(daily);
    app.provide('myApp', this.app)
    app.mount(container);
  }

  async onClose() {
    // Nothing to clean up.
  }
}
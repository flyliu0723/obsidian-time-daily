import { Plugin, addIcon } from "obsidian";
import { SampleSettingTab } from "./setting-tab";
import { ExampleView, VIEW_TYPE_EXAMPLE } from "./view";

export default class SamplePlugin extends Plugin {
    onload() {
        this.addSettingTab(new SampleSettingTab(this.app, this));


        this.registerView(
            VIEW_TYPE_EXAMPLE,
            (leaf) => new ExampleView(leaf, this.app)
        );
    
        this.addRibbonIcon("dice", "Activate view", () => {
            this.activateView();
        });
    }
    onunload() {
        this.app.workspace.detachLeavesOfType(VIEW_TYPE_EXAMPLE);
    }
    async activateView() {
        this.app.workspace.detachLeavesOfType(VIEW_TYPE_EXAMPLE);
    
        await this.app?.workspace?.getLeaf(true)?.setViewState({
          type: VIEW_TYPE_EXAMPLE,
          active: true
        })
    
        this.app.workspace.revealLeaf(
          this.app.workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE)[0]
        );
      }
}

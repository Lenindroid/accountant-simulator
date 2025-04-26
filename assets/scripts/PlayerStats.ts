import { _decorator, Component, Node, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerStats')
export class PlayerStats extends Component {
    @property({
        type: ProgressBar, 
        tooltip: "Here goes the family bar"
    })
    public familyBar : ProgressBar;
    public familyValue : number = 100;

    @property({
        type: ProgressBar, 
        tooltip: "Here goes the work bar"
    })
    public workBar :  ProgressBar;
    public workValue : number = 100;

    updateFamily(newValue : number) {
        this.familyValue = newValue;
        if (newValue > 0) this.familyBar.progress = newValue / 100;
        else {
            this.familyBar.progress = 0;
            this.familyValue = 0;
        }
    }

    updateWork(newValue : number) {
        this.workValue = newValue;
        if (newValue > 0) this.workBar.progress = this.workValue / 100;
        else {
            this.workBar.progress = 0;
            this.workValue = 0;
        }
    }

    start() {
        this.updateFamily(20);
        this.updateWork(80);
    }

    /*
    update(deltaTime: number) {
        
    }*/
}
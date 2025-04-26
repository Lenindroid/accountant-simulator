import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;
type Period = 'AM' | 'PM';
type Clock = {
    period: Period,
    hour: number,
    minute: number
}

@ccclass('ProgressDisplayController')
export class ProgressDisplayController extends Component {

    @property({
        type: Label, 
        tooltip: "Here goes the hour label"
    })
    public hourLabel: Label;
    public clock: Clock = {
        period: 'AM',
        hour: 7,
        minute: 35
    }

    @property({
        type: Label, 
        tooltip: "Here goes the money label"
    })
    public moneyLabel : Label;
    public money : number = 0;

    start() {
        this.hourLabel.string = `${this.clock.hour.toString().padStart(2, '0')}:${this.clock.minute.toString().padStart(2, '0')} ${this.clock.period}`;
        this.moneyLabel.string = "$" + this.money;
    }

    updateMoney(newValue : number) {
        this.money = newValue;
        if (this.money < 0) this.money = 0;
        this.moneyLabel.string = "$" + this.money;
    }

    update(deltaTime: number) {
        
    }

    public getTimeOfDay(clock: Clock): 'morning' | 'afternoon' | 'night' {
        const { period, hour } = clock;
    
        if (period === 'AM') {
            if (hour >= 5 && hour < 12) {
                return 'morning';
            } else {
                return 'night'; // e.g., 12 AM to 4 AM
            }
        } else { // PM
            if (hour >= 12 && hour < 6) {
                return 'afternoon';
            } else {
                return 'night';
            }
        }
    }
}



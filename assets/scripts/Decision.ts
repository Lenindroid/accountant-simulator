import { _decorator, Button, Component, JsonAsset, Label, Node, resources } from 'cc';
import { PlayerStats } from './PlayerStats';
import { ProgressDisplayController } from './ProgressDisplayController';
const { ccclass, property } = _decorator;

interface Stats {
    family: number;
    work: number;
    money: number;
}
  
interface DecisionObject {
    id: string;
    location: string;
    hour: number;
    minute: number;
    question: string;
    firstOption: string;
    secondOption: string;
    firstOptionStats: Stats;
    secondOptionStats: Stats;
}

@ccclass('Decision')
export class Decision extends Component {
    private currentDecision : DecisionObject;

    @property({
        type: Node,
        tooltip: 'Decision node'
    })
    public decisionNode : Node;

    @property({
        type: Label,
        tooltip: 'Context of the decision'
    })
    public questionLabel : Label;


    @property({
        type: Label,
        tooltip: 'First option text'
    })
    public textLeft : Label;

    @property({
        type: Label,
        tooltip: 'Second option text'
    })
    public textRight : Label;

    @property({
        type: Node,
        tooltip: 'Node with the stats script'
    })
    private playerStatsNode : Node;
    private playerStatsScript : PlayerStats;

    @property({
        type: Node, 
        tooltip: 'Node with the progress script'
    })
    private progressNode : Node;
    private progressNodeScript : ProgressDisplayController;

    start() {
        this.playerStatsScript = this.playerStatsNode.getComponent(PlayerStats);
        this.progressNodeScript = this.progressNode.getComponent(ProgressDisplayController);

        resources.load('data/decisions', JsonAsset, (err, data) => {
            if (err) {
                console.error('There was an error while trying to access to the dialogs:', err);
                return;
            }
            const decisionsJSON = data.json;
            this.currentDecision = decisionsJSON[1];
            this.renderQuestion(this.currentDecision);
        })
    }

    renderQuestion(decisonData : DecisionObject) {
        this.questionLabel.string = decisonData.question;
        this.textLeft.string = decisonData.firstOption;
        this.textRight.string = decisonData.secondOption;
    }

    leftPressed() {
        const newFamily : number = this.playerStatsScript.familyValue + this.currentDecision.firstOptionStats.family;
        this.playerStatsScript.updateFamily(newFamily);

        const newWork : number = this.playerStatsScript.workValue + this.currentDecision.firstOptionStats.work;
        this.playerStatsScript.updateWork(newWork);

        const newMoney : number = this.progressNodeScript.money + this.currentDecision.firstOptionStats.money;
        this.progressNodeScript.updateMoney(newMoney);
        this.decisionNode.active = false;
    }

    rightPressed() {
        const newFamily : number = this.playerStatsScript.familyValue + this.currentDecision.secondOptionStats.family;
        this.playerStatsScript.updateFamily(newFamily);

        const newWork : number = this.playerStatsScript.workValue + this.currentDecision.secondOptionStats.work;
        this.playerStatsScript.updateWork(newWork);

        const newMoney : number = this.progressNodeScript.money + this.currentDecision.secondOptionStats.money;
        this.progressNodeScript.updateMoney(newMoney);
        this.decisionNode.active = false;
    }

    update(deltaTime: number) {
        
    }
}



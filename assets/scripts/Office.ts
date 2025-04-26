import { _decorator, Button, Component, JsonAsset, Label, Node, resources } from 'cc';
import { Location } from './Location';
const { ccclass, property } = _decorator;

interface JournalEntry {
    accounts: string[];         
    credits: number[];          
    debits: number[];  
    missingDebitOptionIndex: number;           
    missingDebitIndex: number; 
    missingCreditOptionIndex: number;  
    missingCreditIndex: number; 
    options: number[];          
}


@ccclass('Office')
export class Office extends Component {

    private journalIndex : number = 0;

    @property({
        type: Node,
        tooltip: 'The paperwork button node'
    })
    private paperworkNode : Node;

    @property({
        type: Node,
        tooltip: 'The general journal node'
    })
    private generalJournal : Node;

    @property({
        type: Label,
        tooltip: 'Accounts for the minigame'
    })
    private accountOne: Label;

    @property({
        type: Label,
        tooltip: 'Accounts for the minigame'
    })
    private accountTwo: Label;

    @property({
        type: Label,
        tooltip: 'Accounts for the minigame'
    })
    private accountThree: Label;

    @property({
        type: Label,
        tooltip: 'Accounts for the minigame'
    })
    private accountFour: Label;

    @property({
        type: Label,
        tooltip: 'Debit quantities for the minigame'
    })
    private debitOne: Label;

    @property({
        type: Label,
        tooltip: 'Debit quantities for the minigame'
    })
    private debitTwo: Label;

    @property({
        type: Label,
        tooltip: 'Debit quantities for the minigame'
    })
    private debitThree: Label;

    @property({
        type: Label,
        tooltip: 'Debit quantities for the minigame'
    })
    private debitFour: Label;

    @property({
        type: Label,
        tooltip: 'Credit quantities for the minigame'
    })
    private creditOne: Label;

    @property({
        type: Label,
        tooltip: 'Credit quantities for the minigame'
    })
    private creditTwo: Label;

    @property({
        type: Label,
        tooltip: 'Credit quantities for the minigame'
    })
    private creditThree: Label;

    @property({
        type: Label,
        tooltip: 'Credit quantities for the minigame'
    })
    private creditFour: Label;

    @property({
        type: Label,
        tooltip: 'The page of the paper work'
    })
    private page: Label;

    @property({
        type: Label,
        tooltip: 'Option one'
    })
    private optionOne : Label;

    @property({
        type: Label,
        tooltip: 'Option two'
    })
    private optionTwo : Label;

    @property({
        type: Label,
        tooltip: 'Option three'
    })
    private optionThree : Label;

    @property({
        type: Label,
        tooltip: 'Total credit'
    })
    private totalCredit : Label;

    @property({
        type: Label,
        tooltip: 'Total debit'
    })
    private totalDebit : Label;

    private accounts : Label[] = [];
    private debits : Label[] = [];
    private credits : Label[] = [];

    private journals : JournalEntry[] = [];

    start() {
        this.accounts.push(
            this.accountOne,
            this.accountTwo,
            this.accountThree,
            this.accountFour
        );

        this.debits.push(
            this.debitOne,
            this.debitTwo,
            this.debitThree,
            this.debitFour
        );

        this.credits.push(
            this.creditOne,
            this.creditTwo,
            this.creditThree,
            this.creditFour
        );

        resources.load('data/work', JsonAsset, (err, data)=> {
            if(err) {
                console.error(err);
                return;
            }
            this.journals = data.json as JournalEntry[];
        });
    }

    public showPaperWork() : void {
        this.paperworkNode.active = true;
    }

    public updatePaperWork(index : number) : void {
        this.page.string = 'Page ' + (index + 1).toString();

        if(this.journals[index].missingCreditIndex != -1) {
            this.credits[this.journals[index].missingCreditIndex].node.active = false;
        }

        if(this.journals[index].missingDebitIndex != -1) {
            this.debits[this.journals[index].missingDebitIndex].node.active = false;
        }

        for (let i : number = 0; i < 4; i++) {
            this.debits[i].string = this.journals[index].debits[i].toString();
            this.credits[i].string = this.journals[index].credits[i].toString();
            this.accounts[i].string = this.journals[index].accounts[i];
        }

        this.optionOne.string = this.journals[index].options[0].toString();
        this.optionTwo.string = this.journals[index].options[1].toString();
        this.optionThree.string = this.journals[index].options[2].toString();

        let totalCredits : number = this.journals[index].credits.reduce((accum, current)=> {
            return accum + current;
        }, 0);

        if (this.journals[index].missingCreditIndex !== -1) {
            totalCredits -= this.journals[index].credits[this.journals[index].missingCreditIndex]
        }

        this.totalCredit.string = totalCredits.toString();

        let totalDebits : number = this.journals[index].debits.reduce((accum, current)=> {
            return accum + current;
        }, 0);

        if (this.journals[index].missingDebitIndex !== -1) {
            totalDebits -= this.journals[index].debits[this.journals[index].missingDebitIndex];
        }

        this.totalDebit.string = totalDebits.toString();
    }

    public startPaperWork() : void {
        this.updatePaperWork(this.journalIndex);
        this.paperworkNode.active = false;
        this.generalJournal.active = true;
    }

    public finishPaperWork() : void {
        this.generalJournal.active = false;
        this.paperworkNode.getComponent(Button).interactable = false;
    }

    firstOption() {
        if (this.journals[this.journalIndex].missingDebitOptionIndex == 0 || this.journals[this.journalIndex].missingCreditOptionIndex == 0) {

            if(this.journals[this.journalIndex].missingCreditIndex != -1) {
                this.credits[this.journals[this.journalIndex].missingCreditIndex].node.active = true;
            }
    
            if(this.journals[this.journalIndex].missingDebitIndex != -1) {
                this.debits[this.journals[this.journalIndex].missingDebitIndex].node.active = true;
            }

            this.totalCredit.string = this.journals[this.journalIndex].credits.reduce((accum, current)=> {
                return accum + current;
            }, 0).toString();
    
            this.totalDebit.string = this.journals[this.journalIndex].debits.reduce((accum, current)=> {
                return accum + current;
            }, 0).toString();

            this.scheduleOnce(()=> {
                if(this.journalIndex == this.journals.length - 1) {
                    this.finishPaperWork()
                    return;
                }
                this.journalIndex++;
                this.updatePaperWork(this.journalIndex);
                return
            }, 0.3);
        }

        console.log('MAAAL');
    }

    secondOption() {

        if (this.journals[this.journalIndex].missingDebitOptionIndex == 1 || this.journals[this.journalIndex].missingCreditOptionIndex == 1) {
            if (this.journals[this.journalIndex].missingDebitIndex != -1) {
                this.debits[this.journals[this.journalIndex].missingDebitIndex].node.active = true;
            }
    
            if (this.journals[this.journalIndex].missingCreditIndex != -1) {
                this.credits[this.journals[this.journalIndex].missingCreditIndex].node.active = true;
            }
    
            this.totalCredit.string = this.journals[this.journalIndex].credits.reduce((accum, current)=> {
                return accum + current;
            }, 0).toString();
    
            this.totalDebit.string = this.journals[this.journalIndex].debits.reduce((accum, current)=> {
                return accum + current;
            }, 0).toString();

            this.scheduleOnce(()=> {
                if(this.journalIndex == this.journals.length - 1) {
                    this.finishPaperWork()
                    return;
                }
                this.journalIndex++;
                this.updatePaperWork(this.journalIndex);
                return
            }, 0.3);

        }

        console.log('MAAAL');
    }

    thirdOption() {
        if (this.journals[this.journalIndex].missingDebitOptionIndex == 2 || this.journals[this.journalIndex].missingCreditOptionIndex == 2) {

            if (this.journals[this.journalIndex].missingDebitIndex != -1) {
                this.debits[this.journals[this.journalIndex].missingDebitIndex].node.active = true;
            }

            if (this.journals[this.journalIndex].missingCreditIndex != -1) {
                this.credits[this.journals[this.journalIndex].missingCreditIndex].node.active = true;
            }

            this.totalCredit.string = this.journals[this.journalIndex].credits.reduce((accum, current)=> {
                return accum + current;
            }, 0).toString();
    
            this.totalDebit.string = this.journals[this.journalIndex].debits.reduce((accum, current)=> {
                return accum + current;
            }, 0).toString();

            this.scheduleOnce(()=> {
                if(this.journalIndex == this.journals.length - 1) {
                    this.finishPaperWork();
                    return;
                }
                this.journalIndex++;
                this.updatePaperWork(this.journalIndex);
                return
            }, 0.3);
        }

        console.log('MAAAL');
    }

    update(deltaTime: number) {
        
    }
}



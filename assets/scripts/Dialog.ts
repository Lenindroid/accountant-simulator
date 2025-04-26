import { _decorator, Button, Component, Label, Node, Sprite, resources, JsonAsset, SpriteFrame } from 'cc';
import { ProgressDisplayController } from './ProgressDisplayController';
const { ccclass, property } = _decorator;

interface DialogLine {
    order: number;
    image: string;
    speaker: string;
    line: string;
}

interface DialogObject {
    id: string;
    location: string;
    requiredStats: object;
    lines: DialogLine[];
}

@ccclass('Dialog')
export class Dialog extends Component {
    @property({
        type: Node, 
        tooltip: 'Dialog node'
    })
    public dialogNode: Node;

    @property({
        type: Sprite,
        tooltip: 'Here goes the face of the character talking'
    })
    public faceSprite : Sprite;

    @property({
        type: Label,
        tooltip: 'Here goes the name of the character talking'
    })
    public characterName : Label;

    @property({
        type: Label,
        tooltip: 'Here goes whatever the character is saying'
    })
    public characterLine : Label;

    @property({
        type: Button, 
        tooltip: 'Here goes the "continue" button'
    })
    public button: Button;

    @property({
        type: Node,
        tooltip: 'Access to ProgressDisplayController'
    })
    public progressNode : Node;

    public currentLine : number = 0;

    private currentDialog : DialogObject;

    start() {
        resources.load('data/dialogs', JsonAsset, (err, data) => {
            if (err) {
                console.error('There was an error while trying to access to the dialogs:', err);
                return;
            }
            const dialogsJSON = data.json;
            this.currentDialog = dialogsJSON[0];
            this.updateDialogBox(this.currentDialog.lines[this.currentLine]);
        })
    }

    updateDialogBox(line: DialogLine) {
        this.changeSprite(line.image);
        this.characterName.string = line.speaker;
        this.characterLine.string = line.line;
    }

    changeSprite(path: string) {
        resources.load(path, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.error(`Error loading sprite: ${err}`);
                return;
            }
            this.faceSprite.spriteFrame = spriteFrame;
        });
    }

    //Just like an event listener 
    continuePressed() {
        if (this.currentLine + 1  == this.currentDialog.lines.length) {
            this.dialogNode.active = false;
        } else {
            this.currentLine++;
            this.updateDialogBox(this.currentDialog.lines[this.currentLine]);
        }
    }

    update(deltaTime: number) {
        
    }
}



import { _decorator, Button, Component, Label, Node, Sprite, resources, JsonAsset, SpriteFrame } from 'cc';
import { ProgressDisplayController } from './ProgressDisplayController';
import { Location } from './Location';
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
        tooltip: 'The paperwork button node'
    })
    private paperworkNode : Node;

    @property({
        type: Node,
        tooltip: 'Access to ProgressDisplayController'
    })
    public progressNode : Node;

    @property({
        type: Node,
        tooltip: 'Access to the location controller'
    })
    public locationNode : Node;
    public locationScript: Location;

    public currentLine : number = 0;
    public dialogIndex : number = 0;

    private currentDialog : DialogObject;
    private dialogsJSON : DialogObject;

    start() {
        resources.load('data/dialogs', JsonAsset, (err, data) => {
            if (err) {
                console.error('There was an error while trying to access to the dialogs:', err);
                return;
            }
            this.dialogsJSON = data.json as DialogObject;
            this.currentDialog = this.dialogsJSON[0];
        });
        this.locationScript = this.locationNode.getComponent(Location);
    }

    public diplayDialog() {
        this.dialogNode.active = true;
        this.updateDialogBox(this.currentDialog.lines[this.currentLine]);
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
            this.dialogIndex++;
            this.currentDialog = this.dialogsJSON[this.dialogIndex];
            this.currentLine = 0;
            if (this.dialogIndex == 1) {
                this.locationScript.goToOffice();
                this.paperworkNode.active = true;
            }
            
            if (this.dialogIndex == 2) {
                this.scheduleOnce(()=> {
                    this.dialogNode.active = true;
                }, 0.3);
            }
            if (this.dialogIndex == 3) {
                this.paperworkNode.getComponent(Button).interactable = true;
            }
            
        } else {
            this.currentLine++;
            this.updateDialogBox(this.currentDialog.lines[this.currentLine]);
        }
    }

    update(deltaTime: number) {
        
    }
}



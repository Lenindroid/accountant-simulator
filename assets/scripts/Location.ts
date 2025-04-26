import { _decorator, Button, Component, JsonAsset, Label, Node, resources, Sprite, SpriteFrame } from 'cc';
import { ProgressDisplayController } from './ProgressDisplayController';
import { PlayerStats } from './PlayerStats';
import { Office } from './Office';
const { ccclass, property } = _decorator;

type LocationButtonData = {
    button: Button,
    locationID: string
};

interface DialogReference {
    id: string;
    locked: boolean;
}

interface TimeRange {
    minimum: number;
    maximum: number;
}

interface RequiredStats {
    pm: TimeRange;
    am: TimeRange;
    minimumWork: number;
    minimumFamily: number;
    minimumMoney: number;
}


interface Room {
    id: string;
    locked: boolean;
    image: {
        morning: string;
        afternoon: string;
        night: string;
    };
    dialogs: DialogReference[];
    requiredStats : RequiredStats;
}


@ccclass('Location')
export class Location extends Component {
    @property({
        type: Node,
        tooltip: 'Locations UI node'
    })
    private locationsUI : Node;

    @property({
        type: Sprite,
        tooltip: 'Background image'
    })
    public backgroundImageSprite : Sprite;

    @property({
        type: Node,
        tooltip: 'The progress display controller script'
    })
    private progressNode : Node;
    private progressScript : ProgressDisplayController;

    @property({
        type: Node,
        tooltip: 'The office manager script'
    })
    private officeNode : Node;
    private officeScript : Office;

    @property({
        type: Node,
        tooltip: 'Player stats script node'
    })
    private playerStatsNode : Node;
    private playerStatsScript : PlayerStats;

    @property({
        type: Node,
        tooltip: 'Inside locations'
    })
    private insideLocationsUI : Node;

    @property({
        type: Node,
        tooltip: 'Outside locations group'
    })
    private outsideLocationsUI : Node;

    @property({
        type: Label,
        tooltip: 'Shows the area type'
    })
    private environmentNode : Label;

    @property({
        type: Button,
        tooltip: 'Bedroom button'
    })
    private bedroomButton : Button;

    @property({
        type: Button,
        tooltip: 'Son button'
    })
    private sonBedroomButton : Button;

    @property({
        type: Button,
        tooltip: 'Kitchen button'
    })
    private kitchenButton : Button;

    @property({
        type: Button,
        tooltip: 'Living room button'
    })
    private livingRoomButton : Button;

    @property({
        type: Button,
        tooltip: 'Living room button'
    })
    private officeButton : Button;
    
    private locationButtons: LocationButtonData[] = [];

    public location : Room;
      

    start() {
        this.locationButtons.push(
            { button: this.bedroomButton, locationID: 'bedroom' },
            { button: this.sonBedroomButton, locationID: 'son-bedroom' },
            { button: this.kitchenButton, locationID: 'kitchen' },
            { button: this.livingRoomButton, locationID: 'living-room' },
            { button: this.officeButton, locationID: 'office' },
        );
        this.progressScript = this.progressNode.getComponent(ProgressDisplayController);
        this.playerStatsScript = this.playerStatsNode.getComponent(PlayerStats);
        this.officeScript = this.officeNode.getComponent(Office);
    }

    update(deltaTime: number) {
        
    }

    checkRoom(room : Room) : boolean {
        if (room.locked) return false;

        if (this.progressScript.clock.period == 'AM') {
            if (!(this.progressScript.clock.hour >= room.requiredStats.am.minimum && this.progressScript.clock.hour < room.requiredStats.am.maximum)) {
                return false;
            }
        } else {
            if (!(this.progressScript.clock.hour >= room.requiredStats.pm.minimum && this.progressScript.clock.hour < room.requiredStats.pm.maximum)) {
                return false;
            }
        }

        if (this.playerStatsScript.workValue < room.requiredStats.minimumWork) return false;
        if (this.playerStatsScript.familyValue < room.requiredStats.minimumFamily) return false;
        if (this.progressScript.money < room.requiredStats.minimumMoney) return false;

        return true;
    }

    private updateLocationButtons() {
        resources.load('data/places', JsonAsset, (err, data)=> {
            if (err) {
                console.error(err);
                return;
            }
    
            const locations: Room[] = data.json as Room[];
    
            this.locationButtons.forEach((button : LocationButtonData) => {
                const room = locations.find((element) => element.id === button.locationID);
                if (!room) {
                    console.error(`Room with id ${button.locationID} not found`);
                    return;
                }
    
                button.button.interactable = this.checkRoom(room);
                console.log(`[updateLocationButtons] ${room.id}: ${button.button.interactable}`);
            });
        });
    }
    
    displayLocations() {
        this.updateLocationButtons();
        this.locationsUI.active = true;
        this.displayLocationsInside();
    }
    
    displayLocationsOutside() {
        this.insideLocationsUI.active = false;
        this.outsideLocationsUI.active = true;
        this.environmentNode.string = 'Outside';
    
        this.updateLocationButtons();
    }
    

    displayLocationsInside() {
        this.outsideLocationsUI.active = false;
        this.insideLocationsUI.active = true;
        this.environmentNode.string = 'Inside';
    }

    hideLocations() {
        this.locationsUI.active = false;
    }

    public changeLocation(id : string) : void {
        resources.load('data/places', JsonAsset, (err, data)=> {
            if(err) {
                console.error('There was an error while trying to load the data ', err);
                return;
            }

            const locations = data.json;

            locations.forEach((element : Room) => {
                if(element.id == id) this.location = element;
            });

            let roomPath : string = this.location.image[this.progressScript.getTimeOfDay(this.progressScript.clock)];

            resources.load(roomPath, SpriteFrame, (err, spriteFrame)=> {
                if (err) {
                    console.error(`Error loading sprite: ${err}`);
                    return;
                }
                this.backgroundImageSprite.spriteFrame = spriteFrame;
                if (id == 'office') this.officeScript.showPaperWork();
            });
        });
    }

    //Buttons alert
    goToBedroom() {
        this.changeLocation('bedroom');
    }

    goToSonRoom() {
        this.changeLocation('son-bedroom');
    }

    goToKitchen() {
        this.changeLocation('kitchen');
    }
    
    goToLivingRoom() {
        this.changeLocation('living-room');
    }
    
    goToOffice() {
        this.changeLocation('office');
    }
    
}



import { _decorator, Component, Node } from 'cc';
import { Location } from './Location';
const { ccclass, property } = _decorator;

@ccclass('Menu')
export class Menu extends Component {
    @property({
        type: Node, 
        tooltip: 'Menu node'
    })
    private menuNode : Node;

    @property({
        type: Node,
        tooltip: 'Location script node'
    })
    private locationNode : Node;
    private locationScript : Location;

    start() {
        this.locationScript = this.locationNode.getComponent(Location);
    }

    play () {
        this.menuNode.active = false;
        this.locationScript.goToLivingRoom();
    }

    update(deltaTime: number) {
        
    }
}



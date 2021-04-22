import {JetView} from "webix-jet";

import Menu from "./menu";
import Toolbar from "./toolbar";

export default class TopView extends JetView {
	config() {
		return {
			rows: [
				Toolbar,
				{cols: [Menu, {$subview: true}]}
			]
		};
	}
}

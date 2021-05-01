import {JetView} from "webix-jet";

import events from "../constants/events";
import ActivitiesDataTable from "./activities-elements/activitiesDataTable";

export default class Activities extends JetView {
	config() {
		return {
			rows: [
				{
					cols: [
						{},
						{
							view: "button",
							label: "Add activity",
							type: "icon",
							icon: "wxi-user",
							align: "right",
							width: 120,
							click: () => this.app.callEvent(events.SHOW_POPUP)
						}
					]
				},
				ActivitiesDataTable
			]
		};
	}
}

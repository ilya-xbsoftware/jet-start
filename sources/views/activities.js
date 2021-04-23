import {JetView} from "webix-jet";

import activities from "../models/activities";
import activityTypes from "../models/activityTypes";
import contacts from "../models/contacts";
import PopupView from "./window/popup";

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
							click: () => {
								this.ui(new PopupView(this.app, "")).showWindow();
							}
						}
					]},
				{
					view: "datatable",
					localId: "datatable",
					scrollX: false,
					scroll: "auto",
					select: true,
					on: {
						onAfterSelect: (id) => {
							this.show(`../activities?id=${id}`);
						}
					},
					columns: [
						{
							id: "State",
							header: "",
							template: "{common.checkbox()}",
							width: 50
						},
						{
							id: "TypeID",
							header: ["Activity type", {content: "selectFilter"}],
							sort: "string",
							collection: activityTypes,
							fillspace: 1,
							minWidth: 100
						},
						{
							id: "DueDate",
							header: ["Due date", {content: "datepickerFilter"}],
							format: webix.i18n.longDateFormatStr,
							sort: "date",
							fillspace: 1,
							minWidth: 200
						},
						{
							id: "Details",
							header: ["Details", {content: "textFilter"}],
							sort: "text",
							fillspace: 3,
							minWidth: 300
						},
						{
							id: "ContactID",
							header: ["Contact", {content: "selectFilter"}],
							collection: contacts,
							sort: "text",
							fillspace: 1,
							minWidth: 150
						},
						{
							id: "editRow",
							header: "",
							template: "<i class='far fa-edit edit-row'></i>",
							width: 30
						},
						{
							id: "deleteRow",
							header: "",
							template: "<i class='fas fa-trash-alt delete-row'></i>",
							width: 50
						}
					],
					onClick: {
						"delete-row": (event, id) => this._deleteActivity(id.row),
						"edit-row": (event, id) => {
							const editingItem = this._dataTable.getItem(id.row);
							this.ui(new PopupView(this.app, "", editingItem)).showWindow();
						}
					}
				}
			]
		};
	}

	init() {
		this._dataTable = this.$$("datatable");
		activities.waitData.then(() => {
			this._dataTable.sync(activities);
		});
	}

	urlChange() {
		this._urlId = this.getParam("id");
		activities.waitData.then(() => {
			const id = this.getParam("id") || activities.getFirstId();

			if (id && activities.exists(id)) {
				this._dataTable.select(id);
			}
			else {
				this.show("../activities");
			}
		});
	}

	_deleteActivity(id) {
		if (id) {
			webix.confirm("Are you sure?")
				.then(() => {
					activities.remove(id);
				});
		}
	}
}

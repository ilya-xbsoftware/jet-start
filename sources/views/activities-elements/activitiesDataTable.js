import {JetView} from "webix-jet";

import events from "../../constants/events";
import activities from "../../models/activities";
import activityTypes from "../../models/activityTypes";
import contacts from "../../models/contacts";
import PopupView from "../window/popup";


export default class ActivitiesDataTable extends JetView {
	config() {
		return 	{
			view: "datatable",
			localId: "datatable",
			scrollX: false,
			scroll: "auto",
			select: true,
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
					header: ["Due date", {
						content: "datepickerFilter",
						compare(value, filter) {
							if (webix.isDate(value)) {
								const date = webix.Date.copy(value);
								date.setHours(0, 0, 0);
								return filter * 1 === date * 1;
							}
							return false;
						}
					}],
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
					this.app.callEvent(events.SHOW_POPUP, [editingItem]);
				}
			}
		};
	}

	init() {
		this._dataTable = this.$$("datatable");
		this._activitiesCollection = activities;
		this._dataTable.sync(activities);
		this.collectionFilter();
		this.initPopupView();
	}

	collectionFilter() {
		this._activitiesCollection.filter();
	}

	initPopupView() {
		this.popup = this.ui(PopupView);
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

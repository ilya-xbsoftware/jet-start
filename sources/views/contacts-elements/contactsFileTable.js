import {JetView} from "webix-jet";

import contacts from "../../models/contacts";
import files from "../../models/files";

export default class ContactsFileTable extends JetView {
	config() {
		return {
			rows: [
				{
					view: "datatable",
					localId: "tableWithFiles",
					scroll: "auto",
					scrollX: false,
					fillspace: true,
					columns: [
						{
							id: "name",
							header: "Name",
							sort: "text",
							fillspace: true
						},
						{
							id: "date",
							header: "Change date",
							sort: "date",
							format: webix.i18n.longDateFormatStr,
							fillspace: 1
						},
						{
							id: "sizeText",
							header: "Size",
							sort: this._sortSize,
							fillspace: 1
						},

						{
							header: "",
							width: 60,
							template: "<i class='fas fa-trash-alt delete-row'></i>"
						}
					],
					onClick: {
						"delete-row": (e, id) => this._deleteFile(id)
					}
				},
				{
					cols: [
						{},
						{
							view: "uploader",
							autosend: false,
							localId: "fileUploader",
							width: 200,
							label: "Upload file",
							type: "icon",
							icon: "wxi-plus-circle",
							on: {
								onBeforeFileAdd: (file) => {
									const urlId = this.getParam("id", true);
									const fileData = {
										name: file.name,
										sizeText: file.sizetext,
										size: file.size,
										date: file.file.lastModifiedDate,
										ContactID: urlId
									};
									files.add(fileData);
									return false;
								}
							}
						}
					]
				}
			]
		};
	}

	init() {
		this.$$("tableWithFiles").sync(files);
	}

	urlChange() {
		const urlId = this.getParam("id", true).toString();
		if (!urlId && !contacts.exists(urlId)) {
			return;
		}
		files.data.filter(item => item.ContactID.toString() === urlId);
	}

	_sortSize(first, second) {
		return first.size - second.size;
	}

	_deleteFile(id) {
		if (id) {
			webix.confirm({type: "confirm-message", text: "Are you sure?"})
				.then(() => files.remove(id));
		}
	}
}

const birthdayDateFormat = webix.Date.dateToStr("%D %M %Y");
const dueDateDataFormat = webix.Date.dateToStr("%Y-%m-%d %H:%i");

function confirmMessage(_, text) {
	return webix.confirm({
		title: _(text),
		ok: _("ok"),
		cancel: _("cancel")

	});
}

export {
	birthdayDateFormat,
	dueDateDataFormat,
	confirmMessage
};

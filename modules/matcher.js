
/**
 * @param {string} id - 输入框的ID
 */
function getEditTextId(textId) {
    for (let i = 0; i < 5; i++) {
        var input_bar = id(textId).findOne(3e3);
        if (input_bar != null) {
            return input_bar;
        }
    }
    return null;
}

/**
 * 通用节点查找：根据控件 id 获取节点
 * @param {string} widgetId - 控件ID
 */
function getWidgetById(widgetId) {
    for (let i = 0; i < 5; i++) {
        var widget = id(widgetId).className("android.widget.ImageView").findOne(3e3);
        if (widget != null) {
            return widget;
        }
    }
    return null;
}

module.exports = {
    getEditTextId: getEditTextId,
    getWidgetById: getWidgetById
};
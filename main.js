// 读取配置文件
let config;
try {
    const configPath = files.join(files.cwd(), "config/config.json");
    const configContent = files.read(configPath);
    config = JSON.parse(configContent);
} catch (error) {
    console.error("读取 config.json 失败，请检查文件是否存在且 JSON 格式正确。");
    exit();
}

const pin = String(config.pin || "");
const thread = String(config.threadId || "");
const messageText = String(config.messageText || "");

if (!pin || !thread || !messageText) {
    console.error("config.json 缺少必要字段，请确保包含 pin、threadId、messageText。");
    exit();
}

// 引入模块
let utils = require(files.join(files.cwd(), "modules/unlock_utils.js"));
let matcher = require(files.join(files.cwd(), "modules/matcher.js"));

// 获取屏幕解锁状态
let screenStatus = device.isScreenOn();
// 解锁屏幕
if (!screenStatus) {
    console.log("屏幕未点亮，点亮屏幕并尝试解锁...")
    utils.swipeUp();
    sleep(500); // 等待滑动完成
    utils.unlock(pin);
}

// 启动活动
try {
    console.log("启动飞书对应活动...");
    app.startActivity({
        action: "android.intent.action.VIEW",
        packageName: "com.ss.android.lark",
        className: "com.ss.android.lark.threaddetail.ThreadDetailActivity",
        // 关键：因为该组件未导出，必须使用 root 模式
        root: true,
        extras: {
            "key_params_thread_id": thread,
            "key_params_thread_source": messageText,
            "key_params_show_chat_name": true,
            "key_params_load_from_start": true,
            "key_params_show_keyboard": true,
            "key_params_has_create_thread": true,
            "key_params_jump_position": 0,
            "key_bottom_sheet_container_start": false
        },
        flags: ["activity_new_task", "activity_clear_top"]
    });
    log("Root 启动指令已发送");
} catch (e) {
    log("启动失败，请检查 Root 权限是否授权给 Auto.js：" + e.message);
}


// 选中输入框并输入
let EditTextId = matcher.getEditTextId("kb_rich_text_content_wrapper");

if (EditTextId) {
    console.log("输入框已选中，准备输入文本...");
    EditTextId.click();
    setText(messageText);
} else {
    console.error("未找到输入框，无法继续执行。");
    exit();
}

// 点击发送按钮
console.log("文本输入完成，准备发送...");
sleep(50); // 等待输入稳定
let sendButton = matcher.getWidgetById("btn_send");
if (sendButton) {
    sendButton.click();
    sleep(50);
    console.log("已点击发送");
} else {
    console.error("未找到发送按钮，无法继续执行。");
    exit();
}



// 善后工作
sleep(500);
back();
sleep(250);
back();
sleep(250);
back();

if (!screenStatus) {
    console.log("恢复屏幕状态...");
    Power();
}
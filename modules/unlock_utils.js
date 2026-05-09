function swipeUp() {
    // 1. 检查屏幕是否关闭，如果是则唤醒
    device.wakeUpIfNeeded();
    sleep(800);     // 等待屏幕亮起

    // 获取屏幕尺寸
    let width = device.width;
    let height = device.height;

    // 执行上滑操作（从底部中间滑到顶部中间）
    swipe(
        width / 2,                // 起始X坐标（屏幕中间）
        height * 0.9,             // 起始Y坐标（底部90%位置）
        width / 2,                // 结束X坐标（保持X不变，垂直滑动）
        height * 0.1,             // 结束Y坐标（顶部10%位置）
        50                       // 滑动耗时（毫秒）
    );
    console.log("上滑完成");
}

/**
 * MIUI/小米HyperOS 数字密码自动解锁脚本
 * (V3 - 使用经典 for 循环，保证全版本兼容性)
 * @param {string} password - 你的数字密码
 */
function unlock(password) {
    // 使用 var 替代 const/let 保证兼容性
    if (!password || typeof password !== 'string') {
        console.error("错误：密码为空或格式不正确，请在脚本中填写正确的密码。");
        return;
    }

    if (id("com.android.systemui:id/keyguard_pin_view").exists()) {
        console.log("检测到PIN锁定界面，准备开始解锁...");

        // 步骤 2: 使用经典 for 循环，这是所有JS版本都支持的语法
        for (var i = 0; i < password.length; i++) {
            // 使用 password.charAt(i) 来获取当前循环的数字
            var digit = password.charAt(i);

            console.log(`正在点击数字: ${digit}`);

            // 使用 var 替代 let
            var keyButton = desc(digit).findOne(1000);

            if (keyButton) {
                keyButton.click();
            } else {
                console.error(`错误：未能找到数字 "${digit}" 的按钮！`);
                return; // 停止操作
            }

            // 增加延迟，让操作更稳定
            sleep(150);
        }

        console.log("✓ 密码输入完毕。");

    } else {
        console.log("未检测到PIN锁定界面，脚本无需执行。");
    }
}

module.exports = {
    swipeUp: swipeUp,
    unlock: unlock
};
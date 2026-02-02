export class EndingManager {
    constructor() {
        this.container = null;
    }

    trigger(player, reason) {
        // Determine Ending Type
        let endingType = 'MUNDANE';

        if (player.hp > 0 && player.sanity > 50) {
            // Survived or died happy? 
            // Actually usually trigger on death, so HP usually 0.
            // Let's look at Vision and Sanity.
        }

        if (player.visionValue < 1) {
            // Never awakened
            endingType = 'MUNDANE';
        } else if (player.visionValue > 5 && player.sanity < 30) {
            // Saw too much, went mad
            endingType = 'CONSUMABLE';
        } else if (player.sanity > 50) {
            // High sanity death or victory -> Streamer/Rich
            endingType = 'STREAMER';
        } else {
            // Default tragic
            endingType = 'MUNDANE';
        }

        this.showEnding(endingType);
    }

    showEnding(type) {
        // Create UI
        this.container = document.createElement('div');
        Object.assign(this.container.style, {
            position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: '#000', color: '#fff', zIndex: '2000',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            padding: '40px', fontFamily: "'Courier New', serif", whiteSpace: 'pre-wrap', textAlign: 'center'
        });

        let title = "";
        let text = "";
        let color = "#fff";

        switch (type) {
            case 'MUNDANE':
                title = "结局：无产者的冷雨";
                text = "你猛然惊醒，大口喘着粗气。\n\n环顾四周，是那间熟悉的、潮湿的廉价出租屋。\n窗外下着和梦里一样的冷雨，发出单调的淅沥声。\n\n你看了一眼手机，已经是凌晨三点。\n明天还要早起送外卖。房租还没凑齐。\n\n“又是那个关于怪物的噩梦...”你嘟囔着，裹紧了发黄的被子。\n都市传说，终究只是穷人对抗无聊生活的麻醉剂。";
                color = "#aaa";
                break;
            case 'STREAMER':
                title = "结局：流量的狂欢";
                text = "你从柔软的巨大双人床上醒来。\n\n身边躺着昨天刚认识的伴侣，空气中弥漫着昂贵香水的味道。\n你拿起新款手机，屏幕上是“斯奎奇大王”的直播回放。\n\n“哈，这故事编得真像那么回事。”\n你轻蔑地笑着，顺手刷了一个火箭，看着弹幕里那些信以为真的傻瓜。\n\n你从未真正身处险境。你也是那个吃人系统的一部分。";
                color = "#ffd700";
                break;
            case 'CONSUMABLE':
                title = "结局：消失的耗材";
                text = "你以为自己醒了。\n\n但你发现身体动弹不得，触感冰冷且坚硬。\n头顶上方，巨大的金属齿轮正在缓缓转动，发出轰鸣。\n\n周围都是和你一样的人体，正随着传送带被送往前方那团血红的蒸汽中。\n\n你想要尖叫，却发现发不出声音。\n在那一刻你明白了：\n相信都市传说是危险的。因为你真的成为了它的一部分。";
                color = "#d00";
                break;
        }

        const h1 = document.createElement('h1');
        h1.innerText = title;
        h1.style.color = color;
        h1.style.marginBottom = '20px';

        const p = document.createElement('div');
        p.innerText = text;
        p.style.lineHeight = '2';
        p.style.fontSize = '18px';

        const restart = document.createElement('button');
        restart.innerText = ">> 再做一次梦 (Restart)";
        restart.style.marginTop = '40px';
        restart.style.padding = '10px 20px';
        restart.style.background = 'transparent';
        restart.style.color = color;
        restart.style.border = `1px solid ${color}`;
        restart.style.cursor = 'pointer';
        restart.onclick = () => location.reload();

        this.container.appendChild(h1);
        this.container.appendChild(p);
        this.container.appendChild(restart);
        document.body.appendChild(this.container);
    }
}

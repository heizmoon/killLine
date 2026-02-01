export class EventManager {
    constructor(player, uiCallback) {
        this.player = player;
        this.uiCallback = uiCallback;

        this.events = [
            // SCENE 1 EVENTS
            {
                id: 'beggar_kid_squitch',
                title: '盯着汉堡的小孩',
                image: 'enemy_halloween_kid_pixel_1769172423750.png',
                description: '一个面黄肌瘦的小孩，并没有说“Trick or Treat”。他的双眼布满红血丝，死死盯着你外卖袋里溢出的油脂气味。“给...给我...”',
                choices: [
                    {
                        text: '给他汉堡 (-Burger)',
                        requirement: 'burger',
                        outcome: (p) => {
                            p.removeItem('burger');
                            p.visionValue += 1;
                            p.sanity += 20;
                            return "他像野兽一样撕咬着汉堡，连包装纸都吞了下去。“你看得见了吗？”他抬起头，满嘴是油，瞳孔扩散。灵视开启！";
                        }
                    },
                    {
                        text: '无视',
                        outcome: (p) => {
                            p.sanity -= 5;
                            return "你快步离开。身后传来了指甲抓挠地面的声音。";
                        }
                    }
                ]
            },
            {
                id: 'trash_can',
                title: '路边的垃圾桶',
                description: '散发着恶臭的垃圾桶。也许里面有什么能用的？',
                image: '', // No image for trash can yet, or use default
                choices: [
                    {
                        text: '翻找',
                        outcome: (p) => {
                            const roll = Math.random();
                            if (roll < 0.3) {
                                p.addItem('burger');
                                return "太走运了！还是热的汉堡！获得 [汉堡]";
                            } else if (roll < 0.6) {
                                p.addItem('coat');
                                return "一件旧大衣。获得 [厚棉衣]";
                            } else {
                                p.sanity -= 5;
                                return "什么都没有，只有死老鼠。Sanity -5";
                            }
                        }
                    },
                    { text: '离开', outcome: () => "你离开了。" }
                ]
            },
            // SCENE 2 EVENTS (Sewer)
            {
                id: 'sewer_slime',
                type: 'combat_trigger',
                title: '脂肪山 (The Fatberg)',
                description: '下水道堵塞了。那是一团巨大的、由油脂和垃圾构成的“史莱姆”。仔细看，油脂里包裹着无数人类的毛发、指甲和碎骨——那是上游工厂排出的“废料”。',
                image: 'enemy_slime_pixel_1769176702938.png',
                minVision: 1
            },
            {
                id: 'sugar_apple_hanging',
                title: '“糖霜”苹果',
                description: '屋檐下挂着红色的球体，覆盖着一层白色的“糖霜”。你闻到了一股浓烈的尸臭味。',
                image: 'item_sugar_apple_true_pixel_1769177211263.png',
                choices: [
                    {
                        text: '观察“糖霜” (High Vision)',
                        outcome: (p) => {
                            p.visionValue += 5;
                            p.sanity -= 20;
                            return "你凑近看清了——那不是糖霜，是密密麻麻蠕动的白色蛆虫 (Disco Rice)。它们正在啃食那颗被剥了皮的人头。";
                        }
                    },
                    {
                        text: '离开',
                        outcome: () => "你本能地感到恶心，转身离开。"
                    }
                ]
            },
            // SCENE 3 BOSS
            {
                id: 'corpse_gundam',
                type: 'combat_trigger',
                title: '尸体高达 (Corpse Gundam)',
                description: '工业的奇迹，人性的深渊。这台巨大的机甲由成千上万具无人认领的流浪汉尸体拼装而成。它每迈出一步，关节处都会挤压出黑色的尸油。',
                image: 'enemy_corpse_mech_pixel_1769176726135.png',
                minVision: 1,
                isBoss: true
            }
        ];
    }

    getRandomEvent(sceneIndex) {
        let pool = [];
        if (sceneIndex === 0) {
            if (this.player.visionValue > 0) {
                // Already awakened, don't show kid again.
                // You can add more events here later.
                pool = this.events.filter(e => e.id === 'trash_can');
            } else {
                pool = this.events.filter(e => e.id === 'beggar_kid_squitch' || e.id === 'trash_can');
            }
        } else if (sceneIndex === 1) {
            pool = this.events.filter(e => e.id === 'sewer_slime' || e.id === 'sugar_apple_hanging');
        } else if (sceneIndex >= 2) {
            pool = this.events.filter(e => e.id === 'corpse_gundam');
        }

        if (pool.length === 0) return this.events[0];
        return pool[Math.floor(Math.random() * pool.length)];
    }

    executeChoice(event, choiceIndex) {
        const choice = event.choices[choiceIndex];
        const resultText = choice.outcome(this.player);
        return resultText;
    }
}

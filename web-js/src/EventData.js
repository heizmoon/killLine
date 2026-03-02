export const eventsList = [
    {
        id: 'beggar_kid_squitch',
        title: '盯着汉堡的小孩',
        image: 'enemy_kid',
        description: '一个面黄肌瘦的小孩死死盯着你外卖袋里溢出的油脂气味。“给...给我...”',
        choices: [
            {
                text: '给他汉堡 (-Burger)',
                requirement: 'burger',
                outcome: (p) => {
                    p.visionValue += 1;
                    p.sanity += 20;
                    return "他像野兽一样撕咬着汉堡，连包装纸都吞了下去。灵视开启！";
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
        choices: [
            {
                text: '翻找',
                outcome: (p) => {
                    p.sanity -= 5;
                    return "什么都没有，只有死老鼠。Sanity -5";
                }
            },
            { text: '离开', outcome: () => "你离开了。" }
        ]
    },
    {
        id: 'sewer_slime',
        type: 'combat_trigger',
        title: '脂肪山 (The Fatberg)',
        description: '下水道的一团巨大的、由油脂和垃圾构成的“史莱姆”。',
        image: 'enemy_slime',
        minVision: 1
    },
    {
        id: 'corpse_gundam',
        type: 'combat_trigger',
        title: '尸体高达 (Corpse Gundam)',
        description: '工业的奇迹，人性的深渊。这台巨大的机甲由成千上万具死尸拼装而成。',
        image: 'enemy_mech',
        minVision: 1,
        isBoss: true
    },
    {
        id: 'big_mouse',
        type: 'combat_trigger',
        title: '变异巨鼠 (Big Mouse)',
        description: '下水道里窜出的恶臭生物，体型像一条中型犬。',
        image: 'enemy_BigMouse',
        minVision: 0
    }
];

using System.Collections.Generic;

public static class EventDatabase
{
    public static Dictionary<string, GameEvent> AllEvents = new Dictionary<string, GameEvent>();

    // 静态初始化调用
    public static void Initialize()
    {
        if (AllEvents.Count > 0) return;

        // 1. 盯着汉堡的小孩
        var beggarKid = new GameEvent("beggar_kid_squitch", "盯着汉堡的小孩", "一个面黄肌瘦的小孩死死盯着你外卖袋里溢出的油脂气味。“给...给我...”", "enemy_kid");
        beggarKid.storyComponent = new StoryComponent(new List<EventChoice>
        {
            new EventChoice("给他汉堡 (-Burger)", p => 
            {
                p.ChangeVision(1);
                p.ChangeSanity(20);
                return "他像野兽一样撕咬着汉堡，连包装纸都吞了下去。灵视开启！";
            }, "burger"),
            
            new EventChoice("无视", p =>
            {
                p.ChangeSanity(-5);
                return "你快步离开。身后传来了指甲抓挠地面的声音。";
            })
        });
        AllEvents.Add(beggarKid.id, beggarKid);

        // 2. 路边的垃圾桶
        var trashCan = new GameEvent("trash_can", "路边的垃圾桶", "散发着恶臭的垃圾桶。也许里面有什么能用的？");
        trashCan.storyComponent = new StoryComponent(new List<EventChoice>
        {
            new EventChoice("翻找", p =>
            {
                p.ChangeSanity(-5);
                return "什么都没有，只有死老鼠。Sanity -5";
            }),
            new EventChoice("离开", p => "你离开了。")
        });
        AllEvents.Add(trashCan.id, trashCan);

        // 3. 脂肪山 (The Fatberg) (战斗)
        var sewerSlime = new GameEvent("sewer_slime", "脂肪山 (The Fatberg)", "下水道的一团巨大的、由油脂和垃圾构成的“史莱姆”。", "enemy_slime");
        sewerSlime.combatComponent = new CombatComponent(enemyHp: 30, enemyAtk: 5, loot: new List<string> { "slime_gel" });
        AllEvents.Add(sewerSlime.id, sewerSlime);

        // 4. 尸体高达 (Corpse Gundam) (Boss战斗)
        var corpseGundam = new GameEvent("corpse_gundam", "尸体高达 (Corpse Gundam)", "工业的奇迹，人性的深渊。这台巨大的机甲由成千上万具死尸拼装而成。", "enemy_mech");
        corpseGundam.combatComponent = new CombatComponent(enemyHp: 150, enemyAtk: 15, isBoss: true, loot: new List<string> { "mech_core" });
        AllEvents.Add(corpseGundam.id, corpseGundam);

        // 5. 变异巨鼠 (Big Mouse) (战斗)
        var bigMouse = new GameEvent("big_mouse", "变异巨鼠 (Big Mouse)", "下水道里窜出的恶臭生物，体型像一条中型犬。", "enemy_BigMouse");
        bigMouse.combatComponent = new CombatComponent(enemyHp: 20, enemyAtk: 8);
        AllEvents.Add(bigMouse.id, bigMouse);
    }

    public static GameEvent GetEvent(string id)
    {
        if (AllEvents.Count == 0) Initialize();
        if (AllEvents.TryGetValue(id, out GameEvent value)) return value;
        return null;
    }
}

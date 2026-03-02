using System;
using System.Collections.Generic;

// 基类，仅包含基础属性
public class GameEvent
{
    public string id;
    public string title;
    public string description;
    public string image;

    // 组合组件
    public StoryComponent storyComponent;
    public CombatComponent combatComponent;
    // 可以继续添加 ShopComponent, PuzzleComponent 等

    public GameEvent(string id, string title, string description, string image = "")
    {
        this.id = id;
        this.title = title;
        this.description = description;
        this.image = image;
    }

    // 快捷判断方法
    public bool IsCombatEvent() { return combatComponent != null; }
    public bool IsStoryEvent() { return storyComponent != null; }
}

// 剧情组件：如果事件包含选择分支，则挂载此组件
public class StoryComponent
{
    public List<EventChoice> choices;

    public StoryComponent(List<EventChoice> choices)
    {
        this.choices = choices;
    }
}

// 战斗组件：如果事件是一场战斗，则挂载此组件
public class CombatComponent
{
    public int enemyHp;
    public int enemyAtk;
    public bool isBoss;
    public List<string> loot; // 战斗胜利掉落物品ID列表

    public CombatComponent(int enemyHp, int enemyAtk, bool isBoss = false, List<string> loot = null)
    {
        this.enemyHp = enemyHp;
        this.enemyAtk = enemyAtk;
        this.isBoss = isBoss;
        this.loot = loot ?? new List<string>();
    }
}

// 选择分支数据结构
public class EventChoice
{
    public string text;
    public string requirement; // 例如 "burger" 意味着必须拥有物品汉堡才能选择
    
    // 使用 Func (Lambda表达式) 传递具体的玩家状态修改逻辑和返回文本
    public Func<PlayerManager, string> outcome;

    public EventChoice(string text, Func<PlayerManager, string> outcome, string requirement = "")
    {
        this.text = text;
        this.outcome = outcome;
        this.requirement = requirement;
    }
}

using UnityEngine;

public class EventManager : MonoBehaviour
{
    [Header("Current Progress")]
    public LevelStage currentLevel; // 当前关卡 (可以在Inspector中拖拽设置)
    public int currentNodeIndex = 0; // 当前推进到第几个节点

    void Start()
    {
        EventDatabase.Initialize(); // 确保事件数据库被加载
    }

    /// <summary>
    /// 获取当前节点将要发生的事件
    /// </summary>
    public GameEvent GetNextEvent()
    {
        if (currentLevel == null)
        {
            Debug.LogError("EventManager: 未设置 currentLevel");
            return null;
        }

        if (currentNodeIndex >= currentLevel.nodes.Count)
        {
            Debug.Log("EventManager: 已抵达关卡尽头！");
            return null; // 或者触发关卡结算/进入下一关
        }

        NodePool node = currentLevel.nodes[currentNodeIndex];
        currentNodeIndex++; // 指针推到下一个节点

        // 权重骰子机制
        int totalWeight = 0;
        foreach (var ev in node.events)
        {
            totalWeight += ev.weight;
        }

        if (totalWeight <= 0)
        {
            Debug.LogWarning($"EventManager: 节点 {currentNodeIndex - 1} 的总权重为 0 或没有配置任何事件。");
            return null;
        }

        int roll = Random.Range(0, totalWeight);
        int cursor = 0;

        foreach (var ev in node.events)
        {
            cursor += ev.weight;
            if (roll < cursor)
            {
                GameEvent result = EventDatabase.GetEvent(ev.eventId);
                if (result == null)
                {
                    Debug.LogError($"EventManager: 找到了权重，但是在数据库中找不到 ID 为 '{ev.eventId}' 的事件！请检查拼写是否与 EventDatabase 中一致。");
                }
                return result;
            }
        }

        return null;
    }
}

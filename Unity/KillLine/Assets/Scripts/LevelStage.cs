using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public struct EventWeight
{
    public string eventId;
    public int weight; // 权重
}

[System.Serializable]
public class NodePool
{
    // 每个节点（房间）包含一个可能触发事件及其权重的列表
    public List<EventWeight> events = new List<EventWeight>();
}

[CreateAssetMenu(fileName = "New Level Stage", menuName = "KillLine/Level Stage")]
public class LevelStage : ScriptableObject
{
    public string levelName;
    [Tooltip("代表这个关卡的视觉场景预制体（包含地面、雾气、远景等）")]
    public GameObject environmentPrefab;

    // 关卡内的节点列表 (例如杀戮尖塔的一层地图)
    public List<NodePool> nodes = new List<NodePool>();
}

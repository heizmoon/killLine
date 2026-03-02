using UnityEngine;
using System;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    public enum GameState
    {
        WALKING,
        PAUSED // 正在进行事件、战斗，或者在UI界面中
    }

    [Header("State")]
    public GameState gameState = GameState.WALKING;

    [Header("References")]
    public PlayerManager playerManager;
    public EventManager eventManager;

    [Header("Settings")]
    public float timeBetweenNodes = 4f; // 走向下一个节点需要多长时间
    private float walkTimer = 0f;

    [Header("Environment")]
    private GameObject currentEnvironmentInstance; // 追踪当前实例化的场景预制体

    // 对外广播事件触发 (将来UI系统监听此事件)
    public event Action<GameEvent> OnEventTriggered;
    public event Action OnEventEnded;

    void Start()
    {
        if (Instance != null && Instance != this) Destroy(this);
        else Instance = this;

        // 自动获取组件，防止在 Inspector 中忘记拖拽
        if (eventManager == null) eventManager = GetComponent<EventManager>();
        if (playerManager == null) playerManager = GetComponent<PlayerManager>();

        // 如果一开始 EventManager 就有配置关卡，立即加载一次环境
        if (eventManager != null && eventManager.currentLevel != null)
        {
            LoadLevel(eventManager.currentLevel);
        }
    }

    void Update()
    {
        if (gameState == GameState.WALKING)
        {
            walkTimer += Time.deltaTime;

            if (walkTimer >= timeBetweenNodes)
            {
                TriggerNextNode();
                walkTimer = 0f;
            }
        }
    }

    private void TriggerNextNode()
    {
        if (eventManager == null)
        {
            Debug.LogError("GameManager: 找不到 EventManager 组件！请确保它挂载在同一个物体上并已分配。");
            return;
        }

        GameEvent nextEvent = eventManager.GetNextEvent();

        if (nextEvent != null)
        {
            gameState = GameState.PAUSED;
            Debug.Log($"===== 遭遇事件: [{nextEvent.title}] =====");
            
            // 触发事件给表现层 (UI)
            OnEventTriggered?.Invoke(nextEvent);

            // TODO: 如果纯后台逻辑测试，可以在这里自动调用 EndCurrentEvent()，
            // 但正常流程是UI弹窗，玩家点击选项后再调用 EndCurrentEvent() 返回WALKING。
        }
        else
        {
            // 当返回 null 时，说明走到关卡尽头或没抽到事件
            gameState = GameState.PAUSED;
            Debug.Log("===== 关卡完成 =====");
            // 这里可以触发进入下一关的 UI，然后调用 LoadLevel()
        }
    }

    /// <summary>
    /// 加载新关卡（切换场景预制体并重置事件池）
    /// </summary>
    public void LoadLevel(LevelStage newLevel)
    {
        // 1. 设置后台数据
        eventManager.currentLevel = newLevel;
        eventManager.currentNodeIndex = 0;

        // 2. 清理旧场景
        if (currentEnvironmentInstance != null)
        {
            Destroy(currentEnvironmentInstance);
        }

        // 3. 实例化新场景
        if (newLevel.environmentPrefab != null)
        {
            currentEnvironmentInstance = Instantiate(newLevel.environmentPrefab);
        }
        else
        {
            Debug.LogWarning($"GameManager: 关卡 {newLevel.levelName} 没有配置 Environment Prefab！");
        }

        gameState = GameState.WALKING;
        walkTimer = 0f;
        Debug.Log($"===== 已加载新关卡: {newLevel.levelName} =====");
    }

    public void EndCurrentEvent()
    {
        Debug.Log("结束事件，继续前进。");
        OnEventEnded?.Invoke();
        gameState = GameState.WALKING;
    }
}

using UnityEngine;

[RequireComponent(typeof(Renderer))]
public class UVScroller : MonoBehaviour
{
    [Header("Scroll Speed Settings")]
    [Tooltip("UV贴图的滚动速度。正Y值表示贴图向下滚动（产生向前奔跑的错觉）")]
    public Vector2 scrollSpeed = new Vector2(0f, 0.5f);

    private Renderer rend;
    private Material mat;
    private Vector2 currentOffset;

    void Start()
    {
        rend = GetComponent<Renderer>();
        // 获取材质的实例，以免修改影响到所有使用该材质的物体
        mat = rend.material; 
        currentOffset = mat.mainTextureOffset;
    }

    void Update()
    {
        // 只有当 GameManager 存在并且游戏状态是前进 (WALKING) 时才滚动场景
        if (GameManager.Instance != null && GameManager.Instance.gameState == GameManager.GameState.WALKING)
        {
            // 随时间增加 UV 偏移量
            currentOffset += scrollSpeed * Time.deltaTime;
            
            // 赋值回材质
            mat.mainTextureOffset = currentOffset;
        }
    }
}

# Unity 2D 迁移与配置指南

本项目已初步完成从 Web 版到 Unity 2D 的逻辑迁移。以下是在 Unity 编辑器中完成搭建的步骤：

## 1. 基础环境设置
- 打开 Unity Hub，创建一个新的 **2D Core** 项目，位置选在 `unity` 文件夹下。
- 确保项目设置中的 **Api Compatibility Level** 为 .NET Standard 2.1 或更高。

## 2. 资源导入设置 (重要)
- 导航至 `Assets/Sprites` 文件夹。
- 选中所有像素图，在 **Inspector** 窗口中进行以下设置：
    - **Texture Type**: Sprite (2D and UI)
    - **Sprite Mode**: Single (或根据需要 Multiple 切分)
    - **Pixels Per Unit**: 建议设为 32 或 16 (取决于你的美术规格)
    - **Mesh Type**: Full Rect
    - **Filter Mode**: **Point (no filter)** (关键：确保像素清晰)
    - **Compression**: **None**
- 点击 **Apply**。

## 3. 场景搭建
1. **创建 Manager 对象**：
   - 在层级面板 (Hierarchy) 创建一个名为 `_Managers` 的空对象。
   - 分别挂载 `PlayerManager`, `EventManager`, `WorldScroller`, `GameManager` 脚本。
   - 在 `GameManager` 中将对应的 Manager 拖入其引用槽位。

2. **UI 搭建**：
   - 创建一个 **Canvas**。
   - 创建一个 **Image** 作为玩家的手部显示 (`PlayerHand`)，并将其引用拖给 `PlayerManager` 的 `Hand Sprite Image` 槽位。
   - 创建 HP/Sanity/Vision 等血条。

3. **事件数据 (ScriptableObjects)**：
   - 在 `Assets` 文件夹右键：`Create > KillLine > Event`。
   - 创建 `BeggarKid`, `TrashCan` 等事件文件。
   - 在 `EventManager` 的 `All Events` 列表中添加这些文件。

## 4. 运行游戏
- 确保 `GameManager` 脚本中的 `Is Game Active` 在测试时被勾选，或者调用 `StartGame()` 方法。

---
*如有任何脚本报错或逻辑疑问，请随时询问。*

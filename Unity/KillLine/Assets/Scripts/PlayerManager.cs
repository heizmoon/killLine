using System.Collections.Generic;
using UnityEngine;

public class PlayerManager : MonoBehaviour
{
    [Header("Base Stats")]
    public int baseMaxHp = 100;
    public int hp = 100;
    public int sanity = 100;
    public int atk = 5; // Base punch damage

    [Header("Vision Tracker")]
    public int visionValue = 0; // 0-100 Accumulative

    [Header("Inventory & Equipment")]
    public List<string> inventory = new List<string>();
    public string rightHandEquipment = "empty"; // "empty", "lighter", "sword"

    void Start()
    {
        // Initialization if needed
    }

    // --- Stats Calculation ---
    public int GetMaxHp()
    {
        int bonus = 0;
        if (HasItem("coat")) bonus += 20;
        return baseMaxHp + bonus;
    }

    public bool TakeDamage(int amount)
    {
        hp -= amount;
        if (hp < 0) hp = 0;
        Debug.Log($"玩家受到 {amount} 点伤害，当前生命值: {hp}");
        return hp <= 0; // Returns true if dead
    }

    public void Heal(int amount)
    {
        hp += amount;
        int max = GetMaxHp();
        if (hp > max) hp = max;
        Debug.Log($"玩家恢复 {amount} 点生命值，当前生命值: {hp}");
    }

    public void ChangeSanity(int amount)
    {
        sanity += amount;
        if (sanity > 100) sanity = 100;
        if (sanity < 0) sanity = 0;
        Debug.Log($"玩家理智值变化 {amount}，当前理智值: {sanity}");
    }

    public void ChangeVision(int amount)
    {
        visionValue += amount;
        Debug.Log($"玩家灵视变化 {amount}，当前灵视: {visionValue}");
    }

    // --- Inventory ---
    public void AddItem(string itemId)
    {
        inventory.Add(itemId);
        Debug.Log($"获得物品: {itemId}");

        // Simple Auto-equip logic MVP
        if (itemId == "lighter" && rightHandEquipment == "empty")
        {
            Equip("lighter");
        }
        else if (itemId == "sword")
        {
            Equip("sword");
        }
    }

    public void RemoveItem(string itemId)
    {
        if (inventory.Contains(itemId))
        {
            inventory.Remove(itemId);
        }
    }

    public bool HasItem(string itemId)
    {
        return inventory.Contains(itemId);
    }

    public void UseItem(string itemId)
    {
        if (!HasItem(itemId)) return;

        // Implementation depends on Item data structure, placeholder for now
        Debug.Log($"使用了物品: {itemId}");
        RemoveItem(itemId);
    }

    // --- Equipment ---
    public void Equip(string itemId)
    {
        rightHandEquipment = itemId;
        Debug.Log($"装备了武器: {itemId}");
        // Here you would trigger an event or delegate for UI/Visual updates
    }

    public void Unequip()
    {
        Debug.Log($"卸下了武器: {rightHandEquipment}");
        rightHandEquipment = "empty";
    }
}

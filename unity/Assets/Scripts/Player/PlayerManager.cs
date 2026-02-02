using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace KillLine.Player
{
    public class PlayerManager : MonoBehaviour
    {
        [Header("Base Stats")]
        public float baseMaxHp = 100f;
        public float hp = 100f;
        public float sanity = 100f;
        public float atk = 5f;

        [Header("Vision")]
        public float visionValue = 0f; // 0-100 Accumulative

        [Header("Inventory")]
        public List<string> inventory = new List<string>();
        
        [Header("Equipment")]
        public string currentRightHand = "empty"; // "empty", "lighter", "sword"

        [Header("UI References")]
        public Image handSpriteImage;
        public Sprite emptyHandSprite;
        public Sprite lighterSprite;
        public Sprite swordSprite;

        private void Start()
        {
            hp = GetMaxHp();
            Equip("empty");
        }

        public float GetMaxHp()
        {
            float bonus = 0;
            if (HasItem("coat")) bonus += 20;
            return baseMaxHp + bonus;
        }

        public void TakeDamage(float amount)
        {
            hp -= amount;
            if (hp < 0) hp = 0;
            if (hp <= 0) OnDeath();
        }

        public void Heal(float amount)
        {
            hp += amount;
            float max = GetMaxHp();
            if (hp > max) hp = max;
        }

        private void OnDeath()
        {
            Debug.Log("Player Died!");
            // Handle Game Over
        }

        // --- Inventory Management ---
        public void AddItem(string itemId)
        {
            inventory.Add(itemId);
            
            // Auto-equip logic
            if (itemId == "lighter" && currentRightHand == "empty")
            {
                Equip("lighter");
            }
            if (itemId == "sword")
            {
                Equip("sword");
            }
        }

        public void RemoveItem(string itemId)
        {
            inventory.Remove(itemId);
        }

        public bool HasItem(string itemId)
        {
            return inventory.Contains(itemId);
        }

        public void Equip(string itemId)
        {
            currentRightHand = itemId;
            
            if (handSpriteImage == null) return;

            switch (itemId)
            {
                case "empty":
                    handSpriteImage.sprite = emptyHandSprite;
                    break;
                case "lighter":
                    handSpriteImage.sprite = lighterSprite;
                    break;
                case "sword":
                    handSpriteImage.sprite = swordSprite;
                    break;
            }
        }

        public void UpdateHandBob(float walkTime)
        {
            if (handSpriteImage == null) return;
            
            float y = Mathf.Sin(walkTime * 10f) * 10f;
            float x = Mathf.Cos(walkTime * 5f) * 5f;
            handSpriteImage.rectTransform.anchoredPosition = new Vector2(x, y);
        }
    }
}

using System.Collections.Generic;
using UnityEngine;
using KillLine.Player;

namespace KillLine.Events
{
    public class EventManager : MonoBehaviour
    {
        public PlayerManager player;
        public List<EventData> allEvents;
        
        public delegate void EventUIDelegate(EventData data);
        public event EventUIDelegate OnEventTriggered;

        public EventData GetRandomEvent(int sceneIndex)
        {
            List<EventData> pool = new List<EventData>();

            foreach (var e in allEvents)
            {
                // Simple scene-based filtering logic
                // Scene 0: City, Scene 1: Sewer, Scene 2: Factory
                if (sceneIndex == 0 && (e.eventId == "beggar_kid_squitch" || e.eventId == "trash_can"))
                {
                    if (e.eventId == "beggar_kid_squitch" && player.visionValue > 0) continue;
                    pool.Add(e);
                }
                else if (sceneIndex == 1 && (e.eventId == "sewer_slime" || e.eventId == "sugar_apple_hanging"))
                {
                    pool.Add(e);
                }
                else if (sceneIndex >= 2 && e.isBoss)
                {
                    pool.Add(e);
                }
            }

            if (pool.Count == 0) return allEvents[0];
            return pool[Random.Range(0, pool.Count)];
        }

        public string ExecuteChoice(EventData eventData, int choiceIndex)
        {
            var choice = eventData.choices[choiceIndex];
            
            player.hp += choice.hpChange;
            player.sanity += choice.sanityChange;
            player.visionValue += choice.visionChange;

            if (!string.IsNullOrEmpty(choice.addItemId)) player.AddItem(choice.addItemId);
            if (!string.IsNullOrEmpty(choice.removeItemId)) player.RemoveItem(choice.removeItemId);

            return choice.outcomeText;
        }

        public void TriggerEvent(EventData data)
        {
            OnEventTriggered?.Invoke(data);
        }
    }
}

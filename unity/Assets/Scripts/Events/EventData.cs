using UnityEngine;
using System.Collections.Generic;

namespace KillLine.Events
{
    [System.Serializable]
    public class Choice
    {
        public string text;
        public string requirement; // itemId
        public float hpChange;
        public float sanityChange;
        public float visionChange;
        public string outcomeText;
        public string addItemId;
        public string removeItemId;
    }

    [CreateAssetMenu(fileName = "New Event", menuName = "KillLine/Event")]
    public class EventData : ScriptableObject
    {
        public string eventId;
        public string title;
        public Sprite eventImage;
        [TextArea(3, 10)]
        public string description;
        
        public bool isCombatTrigger;
        public bool isBoss;
        public int minVisionRequired;

        public List<Choice> choices;
    }
}

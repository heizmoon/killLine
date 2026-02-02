using UnityEngine;
using KillLine.Player;
using KillLine.World;
using KillLine.Events;

namespace KillLine.Core
{
    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance;

        [Header("Managers")]
        public PlayerManager player;
        public WorldScroller world;
        public EventManager events;

        [Header("State")]
        public bool isGameActive = false;
        public int currentSceneIndex = 0;
        public float gameTime = 0f;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        private void Start()
        {
            // Initial setup can be called here or via an Intro UI
            // StartGame();
        }

        public void StartGame()
        {
            isGameActive = true;
            Debug.Log("Game Started!");
        }

        private void Update()
        {
            if (!isGameActive) return;

            gameTime += Time.deltaTime;
            
            // Hand bobbing based on time
            player.UpdateHandBob(gameTime);

            // Random event check logic (Placeholder)
            if (Random.value < 0.001f) // Very low chance per frame for demo
            {
                TriggerRandomEvent();
            }
        }

        public void TriggerRandomEvent()
        {
            EventData nextEvent = events.GetRandomEvent(currentSceneIndex);
            events.TriggerEvent(nextEvent);
            // Time.timeScale = 0; // Pause game during event if needed
        }

        public void EndEvent()
        {
            // Time.timeScale = 1;
        }
    }
}

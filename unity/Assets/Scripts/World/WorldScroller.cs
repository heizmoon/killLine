using UnityEngine;

namespace KillLine.World
{
    public class WorldScroller : MonoBehaviour
    {
        [Header("Settings")]
        public float scrollSpeed = 5f;
        public float resetPositionZ = 20f;
        public float startPositionZ = -20f;

        [Header("Sprites/Segments")]
        public GameObject[] segments;

        private void Update()
        {
            Scroll(scrollSpeed * Time.deltaTime);
        }

        public void Scroll(float amount)
        {
            foreach (var seg in segments)
            {
                Vector3 pos = seg.transform.position;
                pos.z += amount;

                if (pos.z > resetPositionZ)
                {
                    pos.z = startPositionZ;
                }

                seg.transform.position = pos;
            }
        }
        
        // In Unity 2D, we might use transform.position.x or y depending on orientation.
        // This script assumes Z-axis for consistency with the 3D-ish original, 
        // but can be easily adapted for X/Y.
    }
}

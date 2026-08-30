using UnityEngine;

/// <summary>学生が認識後の処理を追加する最小サンプルです。</summary>
public sealed class WebARSample : MonoBehaviour
{
    public void OnMarkerDetected(string markerName)
    {
        Debug.Log("読み取り結果: " + markerName);
    }
}

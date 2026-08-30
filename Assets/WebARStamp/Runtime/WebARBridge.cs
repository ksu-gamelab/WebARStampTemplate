using System.Runtime.InteropServices;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

/// <summary>
/// Unity と WebGL テンプレート内の WebAR 実装を接続します。
/// JavaScript の SendMessage が参照するため、このコンポーネントを持つ
/// GameObject の名前は "WebARBridge" のままにしてください。
/// </summary>
public sealed class WebARBridge : MonoBehaviour
{
    [System.Serializable]
    public sealed class MarkerDetectedEvent : UnityEvent<string>
    {
    }

    [SerializeField]
    private MarkerDetectedEvent onMarkerDetected = new MarkerDetectedEvent();

    public MarkerDetectedEvent OnMarkerDetectedEvent => onMarkerDetected;

    [SerializeField] Image buttonImage;


#if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")]
    private static extern void StartWebAR_Internal();
#endif

    /// <summary>ブラウザ側の WebAR を起動します。</summary>
    public void StartWebAR()
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        StartWebAR_Internal();
#else
        Debug.Log("WebARはWebGLビルドで実行してください。");
#endif
    }

    /// <summary>JavaScript の SendMessage から呼び出されます。</summary>
    public void OnMarkerDetected(string markerName)
    {
        Debug.Log("認識したマーカー: " + markerName);
        onMarkerDetected.Invoke(markerName);
        if (markerName == "spot_01")
        {
            // スタンプ1を取得したときの処理
            buttonImage.color = Color.black;
        }
        else if (markerName == "spot_02")
        {
            // スタンプ2を取得したときの処理
            buttonImage.color = Color.red;
        }
        else if (markerName == "spot_03")
        {
            // スタンプ3を取得したときの処理
            buttonImage.color = Color.blue;
        }
    }
}

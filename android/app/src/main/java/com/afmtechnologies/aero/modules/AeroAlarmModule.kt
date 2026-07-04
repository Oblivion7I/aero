package com.afmtechnologies.aero.modules

import android.content.Context
import android.hardware.camera2.CameraAccessException
import android.hardware.camera2.CameraManager
import android.media.AudioAttributes
import android.media.AudioManager
import android.media.Ringtone
import android.media.RingtoneManager
import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * Native module backing the Lost Mode "Loud Alarm" and "Flashlight SOS"
 * actions (see src/screens/LostMode/LostModeScreen.tsx and
 * src/hooks/useLostMode.ts).
 *
 * Both actions are only ever invoked from JS after the user has explicitly
 * enabled Lost Mode and tapped the corresponding button — this module does
 * not run anything automatically or in the background.
 */
class AeroAlarmModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  private var ringtone: Ringtone? = null
  private var flashHandler: Handler? = null
  private var flashRunnable: Runnable? = null
  private var isFlashing = false

  override fun getName(): String = "AeroAlarmModule"

  /**
   * Plays the device's default alarm sound on loop, at max volume, ignoring
   * the current ringer/silent mode — so a lost device can be found by ear
   * even if it was left on silent.
   */
  @ReactMethod
  fun startAlarm(promise: Promise) {
    try {
      stopAlarmInternal()
      val context: Context = reactApplicationContext
      val alarmUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
        ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE)
      val tone = RingtoneManager.getRingtone(context, alarmUri)
      tone.audioAttributes = AudioAttributes.Builder()
        .setUsage(AudioAttributes.USAGE_ALARM)
        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
        .build()

      val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
      audioManager.setStreamVolume(
        AudioManager.STREAM_ALARM,
        audioManager.getStreamMaxVolume(AudioManager.STREAM_ALARM),
        0,
      )

      tone.play()
      ringtone = tone
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("ALARM_ERROR", "Could not start alarm: ${e.message}", e)
    }
  }

  @ReactMethod
  fun stopAlarm(promise: Promise) {
    try {
      stopAlarmInternal()
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("ALARM_ERROR", "Could not stop alarm: ${e.message}", e)
    }
  }

  private fun stopAlarmInternal() {
    ringtone?.takeIf { it.isPlaying }?.stop()
    ringtone = null
  }

  /**
   * Pulses the rear camera torch in Morse SOS (... --- ...), repeating
   * until stopFlashlightSos is called. Requires a device with a flash unit.
   */
  @ReactMethod
  fun startFlashlightSos(promise: Promise) {
    try {
      val context = reactApplicationContext
      val cameraManager = context.getSystemService(Context.CAMERA_SERVICE) as CameraManager
      val cameraId = cameraManager.cameraIdList.firstOrNull { id ->
        cameraManager.getCameraCharacteristics(id)
          .get(android.hardware.camera2.CameraCharacteristics.FLASH_INFO_AVAILABLE) == true
      }

      if (cameraId == null) {
        promise.reject("NO_FLASH", "This device has no usable camera flash.")
        return
      }

      stopFlashInternal(cameraManager)
      isFlashing = true
      flashHandler = Handler(Looper.getMainLooper())

      // SOS morse timing in ms: dot=200, dash=600, gap between symbols=200,
      // gap between letters=600, gap between words=1400.
      val pattern = listOf(200L, 200L, 200L, 200L, 200L, 600L) + // S: . . .
        listOf(600L, 200L, 600L, 200L, 600L, 600L) + // O: - - -
        listOf(200L, 200L, 200L, 200L, 200L, 1400L) // S: . . . then word gap

      var step = 0
      flashRunnable = object : Runnable {
        override fun run() {
          if (!isFlashing) return
          val on = step % 2 == 0
          try {
            cameraManager.setTorchMode(cameraId, on)
          } catch (e: CameraAccessException) {
            // Device may have reclaimed the camera (e.g. another app using it) — stop cleanly.
            isFlashing = false
            return
          }
          val delay = pattern[step % pattern.size]
          step++
          flashHandler?.postDelayed(this, delay)
        }
      }
      flashHandler?.post(flashRunnable!!)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("FLASH_ERROR", "Could not start flashlight SOS: ${e.message}", e)
    }
  }

  @ReactMethod
  fun stopFlashlightSos(promise: Promise) {
    try {
      val cameraManager = reactApplicationContext.getSystemService(Context.CAMERA_SERVICE) as CameraManager
      stopFlashInternal(cameraManager)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("FLASH_ERROR", "Could not stop flashlight SOS: ${e.message}", e)
    }
  }

  private fun stopFlashInternal(cameraManager: CameraManager) {
    isFlashing = false
    flashRunnable?.let { flashHandler?.removeCallbacks(it) }
    flashRunnable = null
    try {
      val cameraId = cameraManager.cameraIdList.firstOrNull { id ->
        cameraManager.getCameraCharacteristics(id)
          .get(android.hardware.camera2.CameraCharacteristics.FLASH_INFO_AVAILABLE) == true
      }
      cameraId?.let { cameraManager.setTorchMode(it, false) }
    } catch (e: CameraAccessException) {
      // Ignore — best-effort cleanup.
    }
  }
}

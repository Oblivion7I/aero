package com.afmtechnologies.aero.modules

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.telephony.SmsManager
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * Native module backing Emergency > SOS (see
 * src/screens/Emergency/EmergencyScreen.tsx and src/hooks/useEmergency.ts).
 *
 * Only ever invoked after the user explicitly taps the SOS button and
 * confirms the "Send SOS?" dialog in JS — nothing here runs automatically.
 * Requires android.permission.CALL_PHONE and android.permission.SEND_SMS,
 * requested at runtime the same way as every other Aero permission (see
 * OwnerVerificationScreen / Security > Permission Center).
 */
class AeroEmergencyModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "AeroEmergencyModule"

  private fun hasPermission(permission: String): Boolean =
    ContextCompat.checkSelfPermission(reactApplicationContext, permission) == PackageManager.PERMISSION_GRANTED

  /** Places a direct call (not just opening the dialer) to the given number. */
  @ReactMethod
  fun callNumber(phoneNumber: String, promise: Promise) {
    if (!hasPermission(Manifest.permission.CALL_PHONE)) {
      promise.reject("PERMISSION_DENIED", "CALL_PHONE permission not granted.")
      return
    }
    try {
      val intent = Intent(Intent.ACTION_CALL, Uri.parse("tel:$phoneNumber")).apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      reactApplicationContext.startActivity(intent)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("CALL_ERROR", "Could not place call: ${e.message}", e)
    }
  }

  /** Sends a plain-text SMS to the given number without opening the Messages app. */
  @ReactMethod
  fun sendSms(phoneNumber: String, message: String, promise: Promise) {
    if (!hasPermission(Manifest.permission.SEND_SMS)) {
      promise.reject("PERMISSION_DENIED", "SEND_SMS permission not granted.")
      return
    }
    try {
      val smsManager = reactApplicationContext.getSystemService(SmsManager::class.java)
        ?: SmsManager.getDefault()
      val parts = smsManager.divideMessage(message)
      smsManager.sendMultipartTextMessage(phoneNumber, null, parts, null, null)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("SMS_ERROR", "Could not send SMS: ${e.message}", e)
    }
  }
}

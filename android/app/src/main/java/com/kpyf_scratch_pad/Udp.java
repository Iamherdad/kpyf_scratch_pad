package com.kpyf_scratch_pad;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableArray;
import java.util.Map;
import java.util.HashMap;
import java.net.UnknownHostException;
import java.net.SocketException;
import java.net.DatagramSocket;
import java.net.DatagramPacket;
import android.util.Log;

import java.io.IOException;
import java.net.InetAddress;

public class Udp extends ReactContextBaseJavaModule {

    private static final String TAG = "Udp";
    
    public Udp(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "Udp";
    }

    @ReactMethod
    public void sendUDPMessage(ReadableArray dataArray, String host, int port) {
        DatagramSocket socket = null;
        try {
            // 将 ReadableArray 转换为 byte[]
            byte[] data = new byte[dataArray.size()];
            for (int i = 0; i < dataArray.size(); i++) {
                data[i] = (byte) dataArray.getInt(i);
            }

            // 发送 UDP 消息
            socket = new DatagramSocket();
            InetAddress address = InetAddress.getByName(host);
            DatagramPacket packet = new DatagramPacket(data, data.length, address, port);
            socket.send(packet);

            // 打印消息日志
            Log.i(TAG, "消息发送成功，端口：" + port + "，数据：" + bytesToHex(data));
        } catch (UnknownHostException e) {
            Log.e(TAG, "UnknownHostException: " + e.getMessage(), e);
        } catch (SocketException e) {
            Log.e(TAG, "SocketException: " + e.getMessage(), e);
        } catch (IOException e) {
            Log.e(TAG, "IOException: " + e.getMessage(), e);
        } finally {
            if (socket != null && !socket.isClosed()) {
                socket.close();
            }
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x ", b));
        }
        return sb.toString().trim();
    }
}

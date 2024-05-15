package com.kpyf_scratch_pad;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import java.util.Map;
import java.util.HashMap;
import java.net.UnknownHostException;
import java.net.SocketException;
import android.util.Log;
import com.kpaiedu.LinkServer;
import com.kpaiedu.Config;
import java.net.InetAddress;
import java.io.IOException;


public class Server extends ReactContextBaseJavaModule {

    Server(ReactApplicationContext context) {
        super(context);
    }
    
    @Override
    public String getName() {
        return "Server";
    }

    @ReactMethod
    public void createCalendarEvent(Callback callback) throws IOException {
        Log.d("Server", "Create event called with name: ");
        System.out.println("Create event called with name: " + LinkServer.class);
        InetAddress WS_HOST = InetAddress.getByName(Config.WS_HOST);
        int WS_PORT = Config.WS_PORT;
        LinkServer ls = new LinkServer(WS_HOST, WS_PORT);
        callback.invoke("asdsad", "Event created successfully.");
    }
}

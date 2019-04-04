
#define D0 16
#define D1 5
#define D2 4
#define D3 0  // HAS 10K pullup
#define D4 16
#define D5 15

#include <ESP8266WiFi.h>  //https://github.com/esp8266/Arduino
// needed for library
#include <DNSServer.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>  //https://github.com/tzapu/WiFiManager

// #include "html.h"

// for LED status
#include <Ticker.h>
Ticker ticker;
ESP8266WebServer server(80);
HTTPClient http;
String serverIp = "0.0.0.0";

void tick() {
  // toggle state
  int state = digitalRead(BUILTIN_LED);  // get the current state of GPIO1 pin
  digitalWrite(BUILTIN_LED, !state);     // set pin to the opposite state
}

// gets called when WiFiManager enters configuration mode
void configModeCallback(WiFiManager *myWiFiManager) {
  Serial.println("Entered config mode");
  Serial.println(WiFi.softAPIP());
  // if you used auto generated SSID, print it
  Serial.println(myWiFiManager->getConfigPortalSSID());
  // entered config mode, make led toggle faster
  ticker.attach(0.2, tick);
}

void handleRoot() {
  server.send(
      200, "text/html",
      "<!DOCTYPE html><html lang='en'><head> <meta charset='UTF-8'> <meta "
      "name='viewport' content='width=device-width, initial-scale=1.0'> <meta "
      "http-equiv='X-UA-Compatible' content='ie=edge'> <title>Set Speaker "
      "Server Ip</title></head><body> <div class='container'> <form "
      "action='handle-ip'> <div class='row'> <div class='col-25'> <label "
      "for='ip'>Server IP</label> </div> <input id='ip' name='ip' "
      "placeholder='0.0.0.0' required pattern='^([0-9]{1,3}\.){3}[0-9]{1,3}$'> "
      "</div> <br> <div class='row'> <input type='submit' value='Submit'> "
      "</div> </form> </div> <style> label { padding: 12px 12px 12px 0; "
      "display: inline-block; } input[type=submit] { background-color: "
      "#4CAF50; color: white; padding: 12px 20px; border: none; border-radius: "
      "4px; cursor: pointer; float: right; width: 100%; } input[type=number] { "
      "width: 100%; height: 50%; } .container { border-radius: 5px; "
      "background-color: #f2f2f2; padding: 20px; } .row:after { content: ''; "
      "display: table; clear: both; } </style></body></html>");
}

void handleIp() {
  String message = "";

  if (server.arg("ip") == "") {  // Parameter not found

    message = "ip is not found";
  } else {  // Parameter found

    message = "Ip has been set to = ";
    message += server.arg("ip");  // Gets the value of the query parameter
    serverIp = server.arg("ip");
  }
  server.send(200, "text/plain", message);  // Returns the HTTP response
}

void setup() {
  // pinMode(15, INPUT_PULLUP); has external pulldown
  // pinMode(16, INPUT_PULLUP); seems to have pulldown

  pinMode(14, INPUT_PULLUP);
  pinMode(13, INPUT_PULLUP);
  pinMode(12, INPUT_PULLUP);
  pinMode(4, INPUT_PULLUP);
  pinMode(5, INPUT_PULLUP);

  // put your setup code here, to run once:
  Serial.begin(115200);

  // set led pin as output
  pinMode(BUILTIN_LED, OUTPUT);
  // start ticker with 0.5 because we start in AP mode and try to connect
  ticker.attach(0.6, tick);

  // WiFiManager
  // Local intialization. Once its business is done, there is no need to keep it
  // around
  WiFiManager wifiManager;
  // reset settings - for testing
  // wifiManager.resetSettings();

  // set callback that gets called when connecting to previous WiFi fails, and
  // enters Access Point mode
  wifiManager.setAPCallback(configModeCallback);

  // fetches ssid and pass and tries to connect
  // if it does not connect it starts an access point with the specified name
  // here  "AutoConnectAP"
  // and goes into a blocking loop awaiting configuration
  if (!wifiManager.autoConnect()) {
    Serial.println("failed to connect and hit timeout");
    // reset and try again, or maybe put it to deep sleep
    ESP.reset();
    delay(1000);
  }

  // if you get here you have connected to the WiFi
  Serial.println("connected...yeey :)");
  ticker.detach();
  // keep LED on
  digitalWrite(BUILTIN_LED, LOW);

  server.on("/", handleRoot);
  server.on("/handle-ip", handleIp);
  server.begin();
}

void loop() {
  // put your main code here, to run repeatedly:
  server.handleClient();
  // if (digitalRead(15) == 1)
  // {
  //   Serial.println("15 pressed");
  // }
  //     if (digitalRead(16) == 0)
  // {
  //   Serial.println("D0 pressed");
  // }
  
  // D1(5) -> Start
  // D2(4) -> Stop
  // D5(14) -> Pause
  // D6(12) -> Container
  // D7(13) -> Trash


  if (digitalRead(5) == 0) {
    if (http.begin("http://" + serverIp + "/start")) {
      int httpCode = http.GET();

      if (httpCode > 0) {
        // HTTP header has been send and Server response header has been handled
        Serial.printf("[HTTP] GET... code: %d\n", httpCode);

        // file found at server
        if (httpCode == HTTP_CODE_OK ||
            httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          String payload = http.getString();
          Serial.println(payload);
          server.send(200, "text/html", payload);
        }
      } else {
        Serial.printf("[HTTP] GET... failed, error: %s\n",
                      http.errorToString(httpCode).c_str());
      }
      http.end();
    }
  }
  if (digitalRead(4) == 0) {
    if (http.begin("http://" + serverIp + "/stop")) {
      int httpCode = http.GET();

      if (httpCode > 0) {
        // HTTP header has been send and Server response header has been handled
        Serial.printf("[HTTP] GET... code: %d\n", httpCode);

        // file found at server
        if (httpCode == HTTP_CODE_OK ||
            httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          String payload = http.getString();
          Serial.println(payload);
          server.send(200, "text/html", payload);
        }
      } else {
        Serial.printf("[HTTP] GET... failed, error: %s\n",
                      http.errorToString(httpCode).c_str());
      }
      http.end();
    }
  }
  if (digitalRead(14) == 0) {
    if (http.begin("http://" + serverIp + "/pause")) {
      int httpCode = http.GET();

      if (httpCode > 0) {
        // HTTP header has been send and Server response header has been handled
        Serial.printf("[HTTP] GET... code: %d\n", httpCode);

        // file found at server
        if (httpCode == HTTP_CODE_OK ||
            httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          String payload = http.getString();
          Serial.println(payload);
          server.send(200, "text/html", payload);
        }
      } else {
        Serial.printf("[HTTP] GET... failed, error: %s\n",
                      http.errorToString(httpCode).c_str());
      }
      http.end();
    }
  }
  if (digitalRead(12) == 0) {
    if (http.begin("http://" + serverIp + "/container")) {
      int httpCode = http.GET();

      if (httpCode > 0) {
        // HTTP header has been send and Server response header has been handled
        Serial.printf("[HTTP] GET... code: %d\n", httpCode);

        // file found at server
        if (httpCode == HTTP_CODE_OK ||
            httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          String payload = http.getString();
          Serial.println(payload);
          server.send(200, "text/html", payload);
        }
      } else {
        Serial.printf("[HTTP] GET... failed, error: %s\n",
                      http.errorToString(httpCode).c_str());
      }
      http.end();
    }
  }
  if (digitalRead(13) == 0) {
        if (http.begin("http://" + serverIp + "/trash")) {
      int httpCode = http.GET();

      if (httpCode > 0) {
        // HTTP header has been send and Server response header has been handled
        Serial.printf("[HTTP] GET... code: %d\n", httpCode);

        // file found at server
        if (httpCode == HTTP_CODE_OK ||
            httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          String payload = http.getString();
          Serial.println(payload);
          server.send(200, "text/html", payload);
        }
      } else {
        Serial.printf("[HTTP] GET... failed, error: %s\n",
                      http.errorToString(httpCode).c_str());
      }
      http.end();
    }
  }
}

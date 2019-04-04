// D1(5) -> Start
// D2(4) -> Stop
// D5(14) -> Pause
// D6(12) -> Container
// D7(13) -> Trash

#include <DNSServer.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266WiFi.h>  //https://github.com/esp8266/Arduino
#include <Ticker.h>
#include <WiFiManager.h>  //https://github.com/tzapu/WiFiManager

Ticker ticker;
ESP8266WebServer server(80);
HTTPClient http;
String serverIp = "192.168.1.11";  // TODO: UPDATE THIS AFTER BEFOR RELEASE

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
      "placeholder='" +
          serverIp +
          "' required pattern='^([0-9]{1,3}\.){3}[0-9]{1,3}$'> "
          "</div> <br> <div class='row'> <input type='submit' value='Submit'> "
          "</div> </form> </div></body></html>");
}

void handleIp() {
  String message = "";
  if (server.arg("ip") == "") {
    message = "You didn't provide an ip address!";
  } else {
    message = "Ip has been set to = ";
    message += server.arg("ip");  // Gets the value of the query parameter
    serverIp = server.arg("ip");
  }
  server.send(200, "text/plain", message);  // Returns the HTTP response
}

void makeRequest(String url) {
  if (http.begin(url)) {
    int httpCode = http.GET();
    if (httpCode > 0) {
      if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
        String payload = http.getString();
        server.send(200, "text/html", payload);
      }
    }
    http.end();
  }
}

void setup() {
  pinMode(14, INPUT_PULLUP);
  pinMode(13, INPUT_PULLUP);
  pinMode(12, INPUT_PULLUP);
  pinMode(4, INPUT_PULLUP);
  pinMode(5, INPUT_PULLUP);

  Serial.begin(115200);
  pinMode(BUILTIN_LED, OUTPUT);
  ticker.attach(0.6, tick);

  WiFiManager wifiManager;
  wifiManager.setAPCallback(configModeCallback);

  if (!wifiManager.autoConnect()) {
    Serial.println("failed to connect and hit timeout");
    // reset and try again, or maybe put it to deep sleep
    ESP.reset();
    delay(1000);
  }
  // if you get here you have connected to the WiFi

  ticker.detach();
  digitalWrite(BUILTIN_LED, LOW);

  server.on("/", handleRoot);
  server.on("/handle-ip", handleIp);
  server.begin();
}

void loop() {
  server.handleClient();

  if (digitalRead(5) == 0) {
    makeRequest("http://" + serverIp + "/start");
  }
  if (digitalRead(4) == 0) {
    makeRequest("http://" + serverIp + "/stop");
  }
  if (digitalRead(14) == 0) {
    makeRequest("http://" + serverIp + "/pause");
  }
  if (digitalRead(12) == 0) {
    makeRequest("http://" + serverIp + "/container");
  }
  if (digitalRead(13) == 0) {
    makeRequest("http://" + serverIp + "/trash");
  }
}

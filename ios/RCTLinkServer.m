//
//  RCTCalendarModule.m
//  kpyf_scratch_pad
//
//  Created by 李鹏飞 on 2024/6/13.
//

// RCTLinkServer.m
#import "RCTLinkServer.h"
#import <React/RCTLog.h>
#import "GCDAsyncUdpSocket.h" // 导入 GCDAsyncUdpSocket
@implementation RCTLinkServer
{
  GCDAsyncUdpSocket *udpSocket; // 添加一个 UDP Socket 实例变量
}

// To export a module named RCTLinkServer
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)name location:(NSString *)location)
{
 RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}

// 发送 UDP 消息
RCT_EXPORT_METHOD(sendUDPMessage:(NSArray<NSNumber *> *)dataArray host:(NSString *)host port:(nonnull NSNumber *)port)
{
    if (!udpSocket) {
        uint16_t portValue = [port unsignedShortValue];
        udpSocket = [[GCDAsyncUdpSocket alloc] initWithDelegate:self delegateQueue:dispatch_get_main_queue()];
    }
    
    // 将 NSArray 转换为 NSData
    NSMutableData *data = [NSMutableData dataWithCapacity:dataArray.count];
    for (NSNumber *number in dataArray) {
        uint8_t byte = [number unsignedCharValue];
        [data appendBytes:&byte length:sizeof(byte)];
    }
    
    uint16_t portValue = [port unsignedShortValue];
    RCTLogInfo(@"消息发送成功，端口：%hu，数据：%@", portValue, data);
    [udpSocket sendData:data toHost:host port:portValue withTimeout:-1 tag:0];
}



//发送 UDP 消息
//RCT_EXPORT_METHOD(sendUDPMessage:(NSString *)base64Message host:(NSString *)host  port:(nonnull NSNumber *)port)
//{
//  if (!udpSocket) {
//    uint16_t portValue = [port unsignedShortValue];
//    udpSocket = [[GCDAsyncUdpSocket alloc] initWithDelegate:self delegateQueue:dispatch_get_main_queue()];
//  }
//
//  // 将Base64编码的字符串转换回NSData
//  NSData *data = [[NSData alloc] initWithBase64EncodedString:base64Message options:0];
//
//  uint16_t portValue = [port unsignedShortValue];
//  RCTLogInfo(@"消息发送成功，端口：%hu，数据：%@", portValue, data);
//  [udpSocket sendData:data toHost:host port:portValue withTimeout:-1 tag:0];
//}

@end

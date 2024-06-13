//
//  RCTCalendarModule.m
//  kpyf_scratch_pad
//
//  Created by 李鹏飞 on 2024/6/13.
//

// RCTLinkServer.m
#import "RCTLinkServer.h"
#import <React/RCTLog.h>
@implementation RCTLinkServer

// To export a module named RCTLinkServer
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)name location:(NSString *)location)
{
 RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}

@end

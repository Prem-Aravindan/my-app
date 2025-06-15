#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <ReplayKit/ReplayKit.h>

@interface ScreenStreamModule : RCTEventEmitter <RCTBridgeModule, RPBroadcastActivityViewControllerDelegate, RPBroadcastControllerDelegate>

@property (nonatomic, strong) RPBroadcastController *broadcastController;
@property (nonatomic, assign) BOOL isStreaming;
@property (nonatomic, assign) NSInteger frameCount;

@end

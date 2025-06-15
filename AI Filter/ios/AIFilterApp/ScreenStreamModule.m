#import "ScreenStreamModule.h"
#import <React/RCTLog.h>
#import <ReplayKit/ReplayKit.h>
#import <CoreVideo/CoreVideo.h>
#import <CoreImage/CoreImage.h>
#import <UIKit/UIKit.h>

@interface ScreenStreamModule () <RPBroadcastActivityViewControllerDelegate, RPBroadcastControllerDelegate>

@property (nonatomic, strong) RPBroadcastController *broadcastController;
@property (nonatomic, strong) NSTimer *frameTimer;
@property (nonatomic, assign) BOOL isStreaming;
@property (nonatomic, assign) NSInteger frameCount;
@property (nonatomic, assign) NSInteger intervalMs;
@property (nonatomic, strong) CIContext *ciContext;

@end

@implementation ScreenStreamModule

static NSString * const SCREEN_STREAM_MODULE = @"ScreenStreamModule";
static NSString * const ON_FRAME_EVENT = @"onFrame";
static NSString * const ON_ERROR_EVENT = @"onError";
static NSString * const ON_STATUS_CHANGE_EVENT = @"onStatusChange";

static const NSInteger DEFAULT_INTERVAL_MS = 500;
static const NSInteger TARGET_WIDTH = 224;
static const NSInteger TARGET_HEIGHT = 224;
static const CGFloat JPEG_QUALITY = 0.5;

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.isStreaming = NO;
        self.frameCount = 0;
        self.intervalMs = DEFAULT_INTERVAL_MS;
        self.ciContext = [CIContext context];
    }
    return self;
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[ON_FRAME_EVENT, ON_ERROR_EVENT, ON_STATUS_CHANGE_EVENT];
}

RCT_EXPORT_MODULE(ScreenStreamModule);

RCT_EXPORT_METHOD(isScreenStreamSupported:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if (@available(iOS 11.0, *)) {
        resolve(@YES);
    } else {
        resolve(@NO);
    }
}

RCT_EXPORT_METHOD(requestPermissions:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if (@available(iOS 12.0, *)) {
        dispatch_async(dispatch_get_main_queue(), ^{
            [self showBroadcastPickerWithResolver:resolve];
        });
    } else {
        NSDictionary *result = @{
            @"granted": @NO,
            @"error": @"Screen recording requires iOS 12.0 or later"
        };
        resolve(result);
    }
}

RCT_EXPORT_METHOD(startScreenStream:(NSInteger)intervalMs
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if (self.isStreaming) {
        NSDictionary *result = @{
            @"success": @NO,
            @"error": @"Already streaming"
        };
        resolve(result);
        return;
    }
    
    if (@available(iOS 12.0, *)) {
        self.intervalMs = intervalMs > 0 ? intervalMs : DEFAULT_INTERVAL_MS;
        
        dispatch_async(dispatch_get_main_queue(), ^{
            [self startBroadcastWithResolver:resolve];
        });
    } else {
        NSDictionary *result = @{
            @"success": @NO,
            @"error": @"Screen recording requires iOS 12.0 or later"
        };
        resolve(result);
    }
}

RCT_EXPORT_METHOD(stopScreenStream:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self stopStreamingInternal];
    
    NSDictionary *result = @{@"success": @YES};
    resolve(result);
}

- (void)showBroadcastPickerWithResolver:(RCTPromiseResolveBlock)resolve API_AVAILABLE(ios(12.0))
{
    RPSystemBroadcastPickerView *broadcastPickerView = [[RPSystemBroadcastPickerView alloc] init];
    broadcastPickerView.preferredExtension = [[NSBundle mainBundle] bundleIdentifier];
    broadcastPickerView.showsMicrophoneButton = NO;
    
    // Create a temporary view controller to present the picker
    UIViewController *rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
    
    // Find the picker button and simulate a tap
    for (UIView *subview in broadcastPickerView.subviews) {
        if ([subview isKindOfClass:[UIButton class]]) {
            UIButton *button = (UIButton *)subview;
            [button sendActionsForControlEvents:UIControlEventTouchUpInside];
            break;
        }
    }
    
    // For demo purposes, resolve immediately
    // In a real implementation, you'd wait for the actual permission result
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        NSDictionary *result = @{
            @"granted": @YES
        };
        resolve(result);
    });
}

- (void)startBroadcastWithResolver:(RCTPromiseResolveBlock)resolve API_AVAILABLE(ios(11.0))
{
    [RPBroadcastActivityViewController loadBroadcastActivityViewControllerWithHandler:^(RPBroadcastActivityViewController * _Nullable broadcastAVC, NSError * _Nullable error) {
        if (error) {
            RCTLogError(@"Failed to load broadcast activity view controller: %@", error.localizedDescription);
            NSDictionary *result = @{
                @"success": @NO,
                @"error": error.localizedDescription
            };
            resolve(result);
            return;
        }
        
        broadcastAVC.delegate = self;
        
        UIViewController *rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
        [rootViewController presentViewController:broadcastAVC animated:YES completion:nil];
        
        // For demo purposes, start streaming simulation
        [self startStreamingSimulation];
        
        NSDictionary *result = @{@"success": @YES};
        resolve(result);
    }];
}

- (void)startStreamingSimulation
{
    self.isStreaming = YES;
    self.frameCount = 0;
    
    // Start frame generation timer
    self.frameTimer = [NSTimer scheduledTimerWithTimeInterval:self.intervalMs / 1000.0
                                                      repeats:YES
                                                        block:^(NSTimer * _Nonnull timer) {
        [self generateSimulatedFrame];
    }];
    
    [self emitStatusChange];
}

- (void)generateSimulatedFrame
{
    // Generate a simple gradient image for demonstration
    UIGraphicsBeginImageContextWithOptions(CGSizeMake(TARGET_WIDTH, TARGET_HEIGHT), NO, 1.0);
    CGContextRef context = UIGraphicsGetCurrentContext();
    
    // Create gradient colors
    CGFloat hue = (self.frameCount % 360) / 360.0;
    UIColor *startColor = [UIColor colorWithHue:hue saturation:0.8 brightness:0.9 alpha:1.0];
    UIColor *endColor = [UIColor colorWithHue:hue saturation:0.4 brightness:0.6 alpha:1.0];
    
    // Draw gradient
    CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
    NSArray *colors = @[(__bridge id)startColor.CGColor, (__bridge id)endColor.CGColor];
    CGGradientRef gradient = CGGradientCreateWithColors(colorSpace, (__bridge CFArrayRef)colors, NULL);
    
    CGPoint startPoint = CGPointMake(0, 0);
    CGPoint endPoint = CGPointMake(TARGET_WIDTH, TARGET_HEIGHT);
    CGContextDrawLinearGradient(context, gradient, startPoint, endPoint, 0);
    
    // Add frame count text
    NSString *frameText = [NSString stringWithFormat:@"Frame %ld", (long)self.frameCount];
    NSDictionary *attributes = @{
        NSFontAttributeName: [UIFont systemFontOfSize:16],
        NSForegroundColorAttributeName: [UIColor whiteColor]
    };
    [frameText drawAtPoint:CGPointMake(10, 10) withAttributes:attributes];
    
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    CGGradientRelease(gradient);
    CGColorSpaceRelease(colorSpace);
    
    // Convert to base64
    NSData *imageData = UIImageJPEGRepresentation(image, JPEG_QUALITY);
    NSString *base64String = [imageData base64EncodedStringWithOptions:0];
    
    self.frameCount++;
    
    // Emit frame data
    [self emitFrameData:base64String width:TARGET_WIDTH height:TARGET_HEIGHT];
}

- (void)stopStreamingInternal
{
    self.isStreaming = NO;
    
    [self.frameTimer invalidate];
    self.frameTimer = nil;
    
    if (@available(iOS 11.0, *)) {
        [self.broadcastController finishBroadcastWithHandler:^(NSError * _Nullable error) {
            if (error) {
                RCTLogError(@"Failed to finish broadcast: %@", error.localizedDescription);
            }
        }];
    }
    
    [self emitStatusChange];
}

- (void)emitFrameData:(NSString *)base64 width:(NSInteger)width height:(NSInteger)height
{
    NSDictionary *frameData = @{
        @"base64": base64,
        @"width": @(width),
        @"height": @(height),
        @"timestamp": @([[NSDate date] timeIntervalSince1970] * 1000)
    };
    
    [self sendEventWithName:ON_FRAME_EVENT body:frameData];
}

- (void)emitError:(NSString *)message
{
    NSDictionary *errorData = @{
        @"message": message
    };
    
    [self sendEventWithName:ON_ERROR_EVENT body:errorData];
}

- (void)emitStatusChange
{
    NSDictionary *statusData = @{
        @"isStreaming": @(self.isStreaming),
        @"frameCount": @(self.frameCount)
    };
    
    [self sendEventWithName:ON_STATUS_CHANGE_EVENT body:statusData];
}

#pragma mark - RPBroadcastActivityViewControllerDelegate

- (void)broadcastActivityViewController:(RPBroadcastActivityViewController *)broadcastActivityViewController
                 didFinishWithBroadcastController:(RPBroadcastController *)broadcastController
                                            error:(NSError *)error API_AVAILABLE(ios(11.0))
{
    [broadcastActivityViewController dismissViewControllerAnimated:YES completion:nil];
    
    if (error) {
        RCTLogError(@"Broadcast setup failed: %@", error.localizedDescription);
        [self emitError:error.localizedDescription];
        return;
    }
    
    self.broadcastController = broadcastController;
    self.broadcastController.delegate = self;
    
    [self.broadcastController startBroadcastWithHandler:^(NSError * _Nullable error) {
        if (error) {
            RCTLogError(@"Failed to start broadcast: %@", error.localizedDescription);
            [self emitError:error.localizedDescription];
        } else {
            RCTLog(@"Broadcast started successfully");
        }
    }];
}

#pragma mark - RPBroadcastControllerDelegate

- (void)broadcastController:(RPBroadcastController *)broadcastController
         didFinishWithError:(NSError *)error API_AVAILABLE(ios(11.0))
{
    RCTLog(@"Broadcast finished");
    [self stopStreamingInternal];
}

- (void)broadcastController:(RPBroadcastController *)broadcastController
      didUpdateServiceInfo:(NSDictionary<NSString *,NSObject<NSCoding> *> *)serviceInfo API_AVAILABLE(ios(11.0))
{
    RCTLog(@"Broadcast service info updated: %@", serviceInfo);
}

#pragma mark - Module Lifecycle

- (void)dealloc
{
    [self stopStreamingInternal];
}

@end
